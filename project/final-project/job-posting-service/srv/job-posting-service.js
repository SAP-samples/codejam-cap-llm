import * as AIHelper from './helper/ai-helper.js';
import * as DBUtils from './helper/db-utils.js';

const wrongInputError = 'Required input parameters not supplied';

export default function () {
  this.on('createVectorEmbeddings', async () => {
    const embeddings = await AIHelper.createVectorEmbeddings();
    const embeddingEntries = await DBUtils.createEmbeddingEntries(embeddings);
    await DBUtils.insertVectorEmbeddings(embeddingEntries);
    return 'Vector embeddings created and stored in database';
  });

  this.on('deleteVectorEmbedding', async () => {
    return await DBUtils.deleteVectorEmbeddings();
  });

  this.on('createJobPosting', async req => {
    const user_query = req.data.user_query;
    validateInputParameter(user_query);
    let entry = await DBUtils.createJobPosting(
      await AIHelper.orchestrateJobPostingCreation(user_query)
    );
    await DBUtils.insertJobPosting(entry);

    return 'Job posting created and stored in database';
  });

  this.on('deleteJobPosting', async req => {
    const id = req.data.id;
    validateInputParameter(id);

    return await DBUtils.deleteJobPosting(id);
  });

  this.on('deleteJobPostings', async () => {
    return await DBUtils.deleteJobPostings();
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
