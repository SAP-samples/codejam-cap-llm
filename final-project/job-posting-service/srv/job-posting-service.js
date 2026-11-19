import * as AIHelper from './helper/ai-helper.js';
import * as DBUtils from './helper/db-utils.js';

const wrongInputError = 'Required input parameters not supplied';

export default function () {
  // Unbound action - creates vector embeddings from grounding data
  this.on('createVectorEmbeddings', async () => {
    const embeddings = await AIHelper.createVectorEmbeddings();
    const embeddingEntries = await DBUtils.createEmbeddingEntries(embeddings);
    await DBUtils.insertVectorEmbeddings(embeddingEntries);

    return {
      count: embeddingEntries.length,
      chunks: embeddingEntries.length,
      message: 'Vector embeddings created and stored in database'
    };
  });

  // Unbound action - creates a new job posting
  this.on('createJobPosting', async (req) => {
    const user_query = req.data.user_query;
    validateInputParameter(user_query);

    const [userQuery, ragResponse] = await AIHelper.orchestrateJobPostingCreation(user_query);
    const entry = DBUtils.createJobPosting([userQuery, ragResponse]);
    await DBUtils.insertJobPosting(entry);

    // Return the created entity (CAP will automatically fetch it with the generated ID)
    return entry;
  });

  // Bound action on JobPostings instance - deletes this specific job posting
  this.on('deleteJobPosting', 'JobPosting', async (req) => {
    // Get ID from the bound entity instance

    const ID = req.params[0].ID;

    const result = await DBUtils.deleteJobPosting(ID);

    return {
      success: true,
      message: result
    };
  });

  // Bound action on JobPostings collection - deletes all job postings
  this.on('deleteAll', 'JobPosting', async (req) => {

    const result = await DBUtils.deleteJobPostings();

    return {
      success: true,
      message: result
    };
  });

  // Bound action on DocumentChunks collection - deletes all document chunks
  this.on('deleteAll', 'DocumentChunk', async (req) => {
    const result = await DBUtils.deleteVectorEmbeddings();

    return {
      success: true,
      message: result
    };
  });
}

function validateInputParameter(parameter) {
  if (typeof parameter === 'undefined') {
    throw new Error(wrongInputError);
  }

  function isEmpty(input) {
    return input.trim() === '';
  }

  if (isEmpty(parameter)) {
    throw new Error(wrongInputError);
  }
}