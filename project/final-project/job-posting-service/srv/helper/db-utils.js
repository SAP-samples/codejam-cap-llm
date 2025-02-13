import cds from '@sap/cds';
const { INSERT, DELETE } = cds.ql;
const { JobPostings, DocumentChunks } = cds.entities;

/**
 * Create the object entry for the DB insert for the Job Posting.
 * @param {[string]} - The user query and RAG response
 * @returns {RAGResponses} - The DB entry object RAGResponses.
 */
export function createJobPosting([userQuery, ragResponse]) {
  const entry = {
    user_query: userQuery,
    rag_response: ragResponse
  };
  return entry;
}

/**
 * Insert the Job Posting entry to the SAP HANA Cloud.
 * @param {JobPostings} jobPosting - The database entry object to be inserted into the HANA DB.
 * @returns {string} - The success message.
 */
export async function insertJobPosting(jobPosting) {
  try {
    await INSERT.into(JobPostings).entries(jobPosting);
    return 'Job Posting inserted successfully to table.';
  } catch (error) {
    console.log(
      `Error while storing the Job Posting to SAP HANA Cloud. \n ${JSON.stringify(
        error.response
      )}`
    );
    throw error;
  }
}

/**
 * Delete Job Posting with the given ID from the JobPostings table.
 * @param {string} id - The id of the entry to be deleted
 * @returns {string} - The success message.
 */
export async function deleteJobPosting(withID) {
  try {
    await DELETE.from(JobPostings).where(JobPostings.id == withID);
    return `Successfully deleted Job Posting with ID: ${withID}`;
  } catch (error) {
    console.log(
      `Error while deleting Job Posting with ID: ${withID} because: \n ${JSON.stringify(
        error.response
      )}`
    );
    throw error;
  }
}

/**
 * Delete all Job Postings from the JobPostings table.
 * @returns {string} - The success message.
 */
export async function deleteJobPostings() {
  try {
    await DELETE.from(JobPostings);
    return 'Successfully deleted Job Postings!';
  } catch (error) {
    console.log(
      `Error while deleting Job Postings: \n ${JSON.stringify(error.response)}`
    );
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
      embedding: array2VectorBuffer(embedding)
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
    await INSERT.into(DocumentChunks).entries(embeddingEntries);

    return `Embeddings inserted successfully to table.`;
  } catch (error) {
    console.log(
      `Error while storing the vector embeddings to SAP HANA Cloud: ${error.toString()}`
    );
    throw error;
  }
}

// Helper method to convert embeddings to buffer for insertion
let array2VectorBuffer = data => {
  const sizeFloat = 4;
  const sizeDimensions = 4;
  const bufferSize = data.length * sizeFloat + sizeDimensions;

  const buffer = Buffer.allocUnsafe(bufferSize);
  // write size into buffer
  buffer.writeUInt32LE(data.length, 0);
  data.forEach((value, index) => {
    buffer.writeFloatLE(value, index * sizeFloat + sizeDimensions);
  });
  return buffer;
};

/**
 * Delete all vector embeddings from the DocumentChunks table.
 * @returns {string} - The success message.
 */
export async function deleteVectorEmbeddings() {
  try {
    await DELETE.from(DocumentChunks);
    return 'Successfully deleted Document Chunks!';
  } catch (error) {
    console.log(
      `Error while deleting Document Chunks: \n ${JSON.stringify(
        error.response
      )}`
    );
  }
}
