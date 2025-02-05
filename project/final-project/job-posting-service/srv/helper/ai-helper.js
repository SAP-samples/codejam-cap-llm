import {
  OrchestrationClient,
  buildAzureContentFilter
} from '@sap-ai-sdk/orchestration';

import { AzureOpenAiEmbeddingClient } from '@sap-ai-sdk/langchain';

import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import path from 'path';

const { DocumentChunks } = cds.entities;
const { SELECT } = cds.ql;

const chatModelName = 'gpt-4o-mini';
const embeddingModelName = 'text-embedding-ada-002';
const resourceGroup = '<Your-Resource-Group>';

async function createVectorEmbeddings() {
  try {
    const loader = new TextLoader(path.resolve('db/data/demo_grounding.txt'));
    const document = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 70,
      chunkOverlap: 0,
      addStartIndex: true
    });

    const splitDocuments = await splitter.splitDocuments(document);

    const textSplits = [];
    for (const chunk of splitDocuments) {
      textSplits.push(chunk.pageContent);
    }

    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0,
      resourceGroup: resourceGroup
    });
    const embeddings = await embeddingClient.embedDocuments(textSplits);

    return [embeddings, splitDocuments];
  } catch (error) {
    console.log(`Error while generating embeddings.
      Error: ${JSON.stringify(error.response)}`);
    throw error;
  }
}

async function orchestrateJobPostingCreation(user_query) {
  try {
    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0,
      resourceGroup: resourceGroup
    });

    let embedding = await embeddingClient.embedQuery(user_query);
    let splits = await SELECT.from(DocumentChunks)
      .orderBy`cosine_similarity(embedding, to_real_vector(${JSON.stringify(
      embedding
    )})) DESC`;

    let text_chunk = splits[0].text_chunks;

    const filter = buildAzureContentFilter({ Hate: 4, Violence: 4 });
    const orchestrationClient = new OrchestrationClient(
      {
        llm: {
          model_name: chatModelName,
          model_params: { max_tokens: 1000, temperature: 0.1 }
        },
        templating: {
          template: [
            {
              role: 'user',
              content:
                ` You are an assistant for HR recruiter and manager.
            You are receiving a user query to create a job posting for new hires.
            Consider the given context when creating the job posting to include company relevant information like pay range and employee benefits.
            The contact details for the recruiter are: Jane Doe, E-Mail: jane.doe@company.com .
            Consider all the input before responding.
            context: ${text_chunk}` + user_query
            }
          ]
        },
        filtering: {
          input: filter,
          output: filter
        },
        masking: {
          masking_providers: [
            {
              type: 'sap_data_privacy_integration',
              method: 'pseudonymization',
              entities: [{ type: 'profile-email' }, { type: 'profile-person' }]
            }
          ]
        }
      },
      { resourceGroup: 'codejam-test' }
    );

    const response = await orchestrationClient.chatCompletion();
    console.log(
      `Successfully executed chat completion. ${response.getContent()}`
    );
    return [user_query, response.getContent()];
  } catch (error) {
    console.log(
      `Error while generating Job Posting.
      Error: ${error.response}`
    );
    throw error;
  }
}

export { createVectorEmbeddings, orchestrateJobPostingCreation };
