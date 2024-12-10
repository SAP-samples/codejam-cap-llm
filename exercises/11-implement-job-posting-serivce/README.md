# Exercise 11 - Implement the Job Posting Service

In the last exercise you have created a deployment for orchestration allowing you to create an orchestration workflow. This workflow can be created with the SAP Cloud SDK for AI including templating, data masking, and content filtering. One thing which is not possible at the moment is grounding. Grounding describes the process of retrieval augmented generation or RAG. Grounding allows you to create vector embeddings for a given contextual document or information source and also get the correct embedding for a given user query making it easy to communicate with the chat model without having to do all of that manually. If you remember, you've done these steps in [exercise 08](../08-implement-job-posting-rag/README.md). SAP is currently working on releasing the grounding functionality within the orchestration service on SAP generative AI Hub and as API within the SAP Cloud SDK for AI. Until this feature is there, you will combine what you have learned about embeddings with the orchestration capabilities you will learn in this exercise.

In this exercise, you will learn the following:

- How to use the SAP Cloud SDK for AI orchestration API.

## Implement the OData function handler code stubs

In exercise 08, you have implemented the RAG flow using the Langchain package of the SAP Cloud SDK for AI. You have implemented the needed function handler for the OData function to execute the RAG flow. You will do the same for the rest of the defined OData functions.

👉 In the function export of the [job-posting-service.js](../../project/job-posting-service/srv/job-posting-service.js) add the following function handlers:

```JavaScript
this.on('createJobPosting', async req => {
    // implementation goes here ...
 });

```

These three function handlers are handling the OData function definitions from the [job-posting-service.cds](../../project/job-posting-service/srv/job-posting-service.cds). You might notice that `createJobPosting` and `deleteJobPosting` get passed in a request parameter. This is necessary to retrieve the user query in the case for creating a job posting and an ID in case of deleting a job posting.

## Implement the job posting creation

With the input validation in place, you can go ahead and implement the creation of a job posting. Before you do that, think about what should happen.

1. A user inputs a query describing what kind of job posting should be created.
2. Your OData service takes the input and passes it through to the orchestration client.
3. The orchestration client establishes connection to a specific chat model, for this Codejam you will use the `gpt-4o-mini`.
4. Together with the query, the orchestration client pushes a template giving extra context, to the chat model.
5. To make sure, there is nothing inappropriate passed to the chat model a input filter is being applied.
6. The chat model processes the request and returns a response to your client.
7. The response gets passed to the `DBUtils` to create a new database entry.
8. The entry then gets inserted into the database with the help of CQL.

To be fair, this seems like a lot but no worries it is actually not that bad. Let's go through it step-by-step.

👉 Within the `createJobPosting` function handler retrieve the user query from the request and pass it to the input validation method you've implemented before:

```JavaScript
const user_query = req.data.user_query;
validateInputParameter(user_query);
```

You will call methods you haven't implemented yet, but no worries this will happen in the next step (Step 1).

👉 Right below the input validation within the `createJobPosting` method, call the following code:

```JavaScript
let entry = await DBUtils.createJobPosting(
    await AIHelper.orchestrateJobPostingCreation(user_query)
);
```

This code is calling the orchestration client for chat completion using the passed in user query (Steps 2 - 6). The result of this gets passed to the `DBUtils` to create a new database entry (Step 7).

The last step is to insert the database entry into the database (Step 8).

👉 Insert the following code as the last line to the `createJobPosting` method:

```JavaScript
await DBUtils.insertJobPosting(entry);
```

Your method should look like this now:

```JavaScript
this.on('createJobPosting', async req => {
    const user_query = req.data.user_query;
    validateInputParameter(user_query);

    let entry = await DBUtils.createJobPosting(
        await AIHelper.orchestrateJobPostingCreation(user_query)
    );
    await DBUtils.insertJobPosting(entry);
});
```

### Implement the AI orchestration in the AIHelper

👉 Open the [AIHelper](../../project/job-posting-service/srv/AIHelper.js) file.

Within the file you need to import the orchestration client and the content filter from the `@sap-ai-sdk/orchestration` package.

👉 Add the following lines of code to the top of the file:

```JavaScript
import {
  OrchestrationClient,
  buildAzureContentFilter
} from '@sap-ai-sdk/orchestration';
```

👉 Below the `executeRAG`, add the `orchestrateJobPostingCreation` method you have also called in the `job-posting-service.js`:

```JavaScript
async function orchestrateJobPostingCreation(user_query) {
  try {
    // implementation goes here
  } catch (error) {
    console.log(
      `Error while generating Job Posting.
      Error: ${JSON.stringify(error.response.data)}`
    );
    throw error;
  }
```

👉 In the `try` block, create a new orchestration client passing in the required LLM, the template, and the filter:

```JavaScript
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
            Use the user query to generate a fitting Job Posting. \n
            ${user_query}`
        }
    ]
    },
        filtering: {
        input: buildAzureContentFilter({
            SelfHarm: 6,
            Hate: 6,
            Sexual: 6,
            Violance: 6
         })
    }
});
```

The client is defined to connect to the `gpt-4o-mini` using a template describing what you want the chat model to do including the user query. Finally you define strict rules for the content filter. The service is not tolerating any inappropriate or discriminating language which is of utmost importance!

👉 Below the initialization of the orchestration client call the client's chat completion method:

```JavaScript
const response = await orchestrationClient.chatCompletion();
```

👉 Finally, return the user query, and the chat model response.

```JavaScript
return [user_query, response.getContent()];
```

If you want to try out the code you can do that by using the `cds watch` command. This command allows you to run your CAP application locally and test it live.

👉 Go ahead and open a new terminal or use your existing one.

👉 Make sure that all dependencies are installed by running the `npm install` command:`

```bash
npm install
```

👉 Make sure that you are still connected to the Cloud Foundry instance by checking the connection details:

```bash
cf target
```

![define-db-schema-check-cf-login](../06-define-db-schema/assets/03-define-db-schema-check-cf-login.png)

If the reply from the CLI tells you to log in again simply enter `cf login`. This time you don't have to specify the API endpoint because it is stored from the previous login.

```bash
cf login
```

👉 Execute the following command and open your application over localhost:

```bash
cds watch --profile hybrid
```

You can observe the console output if you call your service endpoint:

```bash
http://localhost:4004/odata/v4/job-posting-servie/createJobPosting(user_query='Create a job posting for a Software Developer.')
```

## Try out your API

Wow! You did a great job so far and you have implemented a lot of code doing a lot of things.
What you need to do now is play around with your API. CAP has a really nice way of providing the capability of testing HTTP calls to your API - the `HTTP` feature through the testing framework.

Within your project folder you can execute the `cds add http` command to create a `.http` file allowing you to send different HTTP calls.

👉 Open a new terminal or use an existing one.

👉 Make sure you are in the root of the project folder.

👉 Execute the following command:

```bash
cds add http
```

This will add HTTP calls to create, update and delete entities for your OData entities. Last thing you want to add are the calls to your OData functions.

👉 Open the newly created `JobPostingsService.http` file.

👉 Add the following lines of code to the end of the file:

```bash
### Create a Job Posting using the chat model
GET {{server}}/odata/v4/job-posting-service/orchestrateJobPostingCreation(user_query='Create a Job Posting for a JavaScript Developer')
Content-Type: application/json
{{auth}}
```

## Experiment with the orchestration service filters

You spend a lot of time implementing the code to get the orchestration service up and running. You have understood how the API works and how you can integrate it into a CAP application service.

At this point, I would encourage you to go back to the service implementation and play around with the different content filter options on the orchestration service. See how the filter level changes make the chat model respond differently. This will give you a better understanding on how you can utilize content filters to make sure that your AI services behave ethical.

## Summary

In this exercise you have implemented the job posting service and it's OData function handlers. You have utilized the SAP Cloud SDK for AI to connect to SAP AI Core via the orchestration service. You have connected to the orchestration deployment to ask a chat model to create a job posting for you.

At this point the chat model is not taking your company specific information into account. You need to change this to get proper job postings generated where the chat model knows about very specific information like pay ranges, job level, and other contextual information. To do so, you will utilize an Embedding model, vector embeddings and the SAP HANA Cloud Vector Engine.

## Further Reading

- [Query Language (CQL)](https://cap.cloud.sap/docs/cds/cql)
- [@sap-ai-sdk/orchestration - Documentation](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md)
- [CAP - Actions & Functions](https://cap.cloud.sap/docs/guides/providing-services#actions-functions)

---

[Next exercise](../11-data-masking-and-anonymization/README.md)
