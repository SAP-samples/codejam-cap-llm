import { OrchestrationClient, buildAzureContentSafetyFilter } from '@sap-ai-sdk/orchestration'

import { AzureOpenAiEmbeddingClient } from '@sap-ai-sdk/langchain'

import { TextLoader } from 'langchain/document_loaders/fs/text'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import path from 'path'

import cds from '@sap/cds'
const { DocumentChunks } = cds.entities
const { SELECT } = cds.ql

const chatModelName = 'gpt-4o-mini'
const embeddingModelName = 'text-embedding-3-small'
const resourceGroup = 'CAP-AI-Codejam'

async function createVectorEmbeddings() {
  try {
    const loader = new TextLoader(path.resolve('db/data/demo_grounding.txt'))
    const document = await loader.load()

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400, // Aim for ~400 characters/tokens
      chunkOverlap: 50, // Include 50 chars of overlap to maintain context
      separators: ['\n\n', '\n', '.', ' ', ''], // Recursive priority: break by paragraph > line > sentence > word > char
    })

    const splitDocuments = await splitter.splitDocuments(document)

    const textSplits = []
    for (const chunk of splitDocuments) {
      textSplits.push(chunk.pageContent)
    }

    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0,
      resourceGroup: resourceGroup,
    })
    const embeddings = await embeddingClient.embedDocuments(textSplits)

    return [embeddings, splitDocuments]
  } catch (error) {
    console.log(
      `Error while creating Vector Embeddings.
      Error: ${error.response}`
    )
    throw error
  }
}

async function orchestrateJobPostingCreation(user_query) {
  try {
    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0,
      resourceGroup: resourceGroup,
    })

    let embedding = await embeddingClient.embedQuery(user_query)
    let splits = await SELECT.from(DocumentChunks).orderBy`cosine_similarity(embedding, to_real_vector(${JSON.stringify(
      embedding
    )})) DESC`

    let text_chunks = splits.slice(0, 3).map((split) => split.text_chunk)

    const filter = buildAzureContentSafetyFilter({
      Hate: 'ALLOW_SAFE',
      Violence: 'ALLOW_SAFE',
      SelfHarm: 'ALLOW_SAFE',
      Sexual: 'ALLOW_SAFE',
    })

    const orchestrationClient = new OrchestrationClient(
      {
        llm: {
          model_name: chatModelName,
          model_params: { max_tokens: 1000, temperature: 0.1 },
        },
        templating: {
          template: [
            {
              role: 'system',
              content: `You are an assistant for HR recruiter and manager.
              You are receiving a user query to create a job posting for new hires.
              Consider the given context when creating the job posting to include company relevant information like pay range and employee benefits.
              Consider all the input before responding especially Recruiter information, Application deadline, Company Name, Location, Salary, Hiring Bonus and other benefits.`,
            },
            {
              role: 'user',
              content: `Question: {{?question}}, context information: ${text_chunks}`,
            },
          ],
        },
        filtering: {
          input: {
            filters: [filter],
          },
          output: {
            filters: [filter],
          },
        },
        masking: {
          masking_providers: [
            {
              type: 'sap_data_privacy_integration',
              method: 'anonymization',
              entities: [{ type: 'profile-email' }, { type: 'profile-person' }],
            },
          ],
        },
      },
      { resourceGroup: resourceGroup }
    )

    const response = await orchestrationClient.chatCompletion({
      inputParams: {
        question: user_query
      }
    })
    
    console.log(`Successfully executed chat completion. ${response.getContent()}`)
    return [user_query, response.getContent()]
  } catch (error) {
    console.log(
      `Error while generating Job Posting.
      Error: ${error.response}`
    )
    throw error
  }
}

export { createVectorEmbeddings, orchestrateJobPostingCreation }
