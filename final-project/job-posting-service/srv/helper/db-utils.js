import cds from '@sap/cds';
const { INSERT, DELETE } = cds.ql;
const { JobPosting, DocumentChunk } = cds.entities;

/**
 * Create the object entry for the DB insert for the Job Posting.
 * @param {[string]} - The user query and RAG response
 * @returns {RAGResponses} - The DB entry object RAGResponses.
 */
export function createJobPosting([userQuery, ragResponse]) {
  const entry = {
    user_query: userQuery,
    rag_response: ragResponse,
  };
  return entry;
}

/**
 * Insert the Job Posting entry to the SAP HANA Cloud.
 * @param {JobPosting} jobPosting - The database entry object to be inserted into the HANA DB.
 * @returns {string} - The success message.
 */
export async function insertJobPosting(jobPosting) {
  try {
    await INSERT.into(JobPosting).entries(jobPosting);
    return 'Job Posting inserted successfully to table.';
  } catch (error) {
    console.log(`Error while storing the Job Posting to SAP HANA Cloud. \n Error: ${error.response}`);
    throw error;
  }
}

/**
 * Delete Job Posting with the given ID from the JobPosting table.
 * @param {string} id - The id of the entry to be deleted
 * @returns {string} - The success message.
 */
export async function deleteJobPosting(withID) {
  try {
    await DELETE.from(JobPosting).where(JobPosting.id == withID);
    return `Successfully deleted Job Posting with ID: ${withID}`;
  } catch (error) {
    console.log(`Error while deleting Job Posting with ID: ${withID} because: \n Error: ${error.response}`);
    throw error;
  }
}

/**
 * Delete all Job Posting from the JobPostings table.
 * @returns {string} - The success message.
 */
export async function deleteJobPostings() {
  try {
    await DELETE.from(JobPosting);
    return 'Successfully deleted Job Postings!';
  } catch (error) {
    console.log(`Error while deleting Job Postings: \n Error: ${error.response}`);
  }
}

/**
 * Create the object entry for the DB insert for all vector embeddings.
 * @param {[string]} embeddings - vector embeddings.
 * @returns {[DocumentChunks]} - The DB entry object array containing DocumentSplits.
 */
export function createEmbeddingEntries([embeddings, splitDocuments]) {
  let embeddingEntries = [];
  for (const [index, embedding] of embeddings.entries()) {
    const embeddingEntry = {
      metadata: splitDocuments[index].metadata.source,
      text_chunk: splitDocuments[index].pageContent,
      embedding: `[${embedding}]`,
    };
    embeddingEntries.push(embeddingEntry);
  }
  return embeddingEntries;
}

/**
 * Insert the Vector Embedding entries to the HANA DB.
 * @param {[any]} embeddingEntries - The created and converted vector embeddings.
 * @param {string} scenario - The demo scenario flag.
 * @returns {string} - The success message.
 */
export async function insertVectorEmbeddings(embeddingEntries) {
  try {
    await INSERT.into(DocumentChunk).entries(embeddingEntries);

    return `Embeddings inserted successfully to table.`;
  } catch (error) {
    console.log(`Error while storing the vector embeddings to SAP HANA Cloud: ${error.toString()}`);
    throw error;
  }
}

/**
 * Delete all vector embeddings from the DocumentChunks table.
 * @returns {string} - The success message.
 */
export async function deleteVectorEmbeddings() {
  try {
    await DELETE.from(DocumentChunk);
    return 'Successfully deleted Document Chunks!';
  } catch (error) {
    console.log(`Error while deleting Document Chunks: \n ${JSON.stringify(error.response)}`);
  }
}
