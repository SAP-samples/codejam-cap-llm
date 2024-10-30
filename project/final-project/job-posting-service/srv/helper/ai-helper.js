import {
  OrchestrationClient,
  buildAzureContentFilter
} from '@sap-ai-sdk/orchestration';

import {
  AzureOpenAiEmbeddingClient,
  AzureOpenAiChatClient
} from '@sap-ai-sdk/langchain';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');
const filePath = 'db/data/'; //add context information path

const { DocumentSplits } = cds.entities;

const chatModelName = 'gpt-4o-mini';
const embeddingModelName = 'text-embedding-ada-002';

async function orchestrateJobPostingCreation(user_query) {
  try {
    // const embeddingClient = new AzureOpenAiEmbeddingClient({
    //   modelName: embeddingModelName,
    //   maxRetries: 0
    // });

    // let embedding = await embeddingClient.embedQuery(user_query);

    // let splits = await SELECT.from(DocumentSplits)
    //   .orderBy`cosine_similarity(embedding, to_real_vector(${embedding})) DESC`;

    // let text_chunk = splits[0].text_chunks;
    // Utilize the additional information provided in this context: ${text_chunk}. \n
    const orchestrationClient = new OrchestrationClient({
      llm: {
        model_name: chatModelName,
        model_params: { max_tokens: 1000 }
      },
      templating: {
        template: [
          {
            role: 'user',
            content: `You are an assistant for creating Job Postings. 
          Use the user query to generate a fitting Job Posting. 
          
          ${user_query}`
          }
        ]
      },
      filtering: {
        input: buildAzureContentFilter({ SelfHarm: 6 })
      }
    });
    const response = await orchestrationClient.chatCompletion();
    return [user_query, response.getContent()];
  } catch (error) {
    console.log(
      `Error while generating Job Posting.
      Error: ${JSON.stringify(error.response)}`
    );
    throw error;
  }
}

async function createJobPostingUsingComplex(user_query) {
  try {
    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0
    });

    let embedding = await embeddingClient.embedQuery(user_query);

    let splits = await SELECT.from(DocumentSplits)
      .orderBy`cosine_similarity(embedding, to_real_vector(${embedding})) DESC`;

    let text_chunk = splits[0].text_chunks;

    const message = {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `You are an assistant for creating Job Postings. 
          Use the user query to generate a fitting Job Posting. 
          Utilize the additional information provided in this context: ${text_chunk}. \n
          ${user_query}`
        }
      ],
      context: text_chunk
    };

    const chatClient = new AzureOpenAiChatClient({
      modelName: chatModelName,
      maxRetries: 3
    });

    let ragResponse = await chatClient.invoke([message]);

    return [user_query, ragResponse.content];
  } catch (error) {
    console.log(
      `Error while executing RAG. \n Error: ${JSON.stringify(error.response)}`
    );
    throw error;
  }
}

/**
 * Load the specified PDF file, split them into chunks and create embedding vectors using the specified embedding model.
 * Current embedding model: text-embedding-3-large
 * @returns {number[][]} - The created and retrieved vector embeddings.
 */
async function embed() {
  try {
    const documentPath = path.resolve(`${filePath}`);
    const loader = new PDFLoader(documentPath);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200
    });
    const splits = await textSplitter.splitDocuments(docs);

    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0
    });

    const pageContents = splits.flatMap(x => [x.pageContent]);
    let embeddings = await embeddingClient.embedDocuments(pageContents);
    return [embeddings, splits, documentPath];
  } catch (error) {
    console.log(`Error while executing RAG: ${error.response}`);
    throw error;
  }
}

export { orchestrateJobPostingCreation, createJobPostingUsingComplex, embed };
