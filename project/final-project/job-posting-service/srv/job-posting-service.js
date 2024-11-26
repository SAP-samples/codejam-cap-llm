import * as AIHelper from './helper/ai-helper.js';
import * as DBUtils from './helper/db-utils.js';

const wrongInputError = 'Required input parameters not supplied';

export default function () {
  this.on('executeJobPostingRAG', async req => {
    const user_query = req.data.user_query;
    validateInputParameter(user_query);

    let entry = await DBUtils.createJobPosting(
      await AIHelper.executeRAG(user_query)
    );
    await DBUtils.insertJobPosting(entry);
  });

  this.on('createJobPosting', async req => {
    const user_query = req.data.user_query;
    validateInputParameter(user_query);
    let entry = await DBUtils.createJobPosting(
      await AIHelper.orchestrateJobPostingCreation(user_query)
    );
    await DBUtils.insertJobPosting(entry);
  });

  this.on('createJobPostingWithComplex', async req => {
    const user_query = req.data.user_query;
    validateInputParameter(user_query);

    let entry = await DBUtils.createJobPosting(
      await AIHelper.createJobPostingUsingComplex(user_query)
    );
    await DBUtils.insertJobPosting(entry);
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
