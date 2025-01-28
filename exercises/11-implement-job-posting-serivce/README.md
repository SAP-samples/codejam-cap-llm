# Exercise 11 - Implement the Job Posting Service

In the last exercise you have created a deployment for orchestration allowing you to create an orchestration workflow. This workflow can be created with the SAP Cloud SDK for AI including templating, data masking, and content filtering. One thing which is not possible at the moment is grounding. Grounding describes the process of retrieval augmented generation or RAG. Grounding allows you to create vector embeddings for a given contextual document or information source and also get the correct embedding for a given user query making it easy to communicate with the chat model without having to do all of that manually. If you remember, you've done these steps in [Exercise 09](../09-implement-job-posting-rag/README.md).

In this exercise, you will learn the following:

- How to use the SAP Cloud SDK for AI orchestration API.
- How to use the Document Grounding API to create vector embeddings within the orchestration flow.

## Implement the OData function handler code stubs

In [Exercise 09](../09-implement-job-posting-rag/README.md), you have implemented the RAG flow using the Langchain package of the SAP Cloud SDK for AI. If you remember you wrote a lot of code to create vector embeddings, store them in the database and build the complete RAG flow from scratch. You will now add one more function handler implementing the Orchestration API, Orchestration Service and the Grounding API to do all of that for you.

👉 In the function export of the [job-posting-service.js](../../project/job-posting-service/srv/job-posting-service.js) add the following function handlers:

```JavaScript
this.on('createJobPosting', async req => {
    // implementation goes here ...
 });

```

## Implement the job posting creation

Think about what we did in the last exercises and recap what needs to be done:

1. A user inputs a query describing what kind of job posting should be created.
2. Your OData service takes the input and passes it through to the orchestration client.
3. The orchestration client establishes connection to a specific chat model, for this Codejam you will use the `gpt-4o-mini`.
4. Together with the query, the orchestration client pushes a template giving extra context, to the chat model.
5. To make sure, there is nothing inappropriate passed to the chat model a input filter is being applied.
6. The chat model processes the request and returns a response to your client.
7. The response gets passed to the `DBUtils` to create a new database entry.
8. The entry then gets inserted into the database with the help of CQL.

👉 Within the `createJobPosting` function handler retrieve the user query from the request and pass it to the input validation method you've implemented before:

```JavaScript
const user_query = req.data.user_query;
validateInputParameter(user_query);
```

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
  buildAzureContentFilter,
  buildDocumentGroundingConfig
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

👉 In the `try` block, call a document creation function responsible for the embedding part:

```JavaScript
const document = await createDocument();
```

👉 Outside the function `orchestrateJobPostingCreation`, create a new function `createDocument`:

```JavaScript
async function createDocument() {
  // implementation goes here
}

```

The implementation of `createDocument` is using the Document Grounding API to create multiple things:

- A new document collection on AI Core.
- A new document including the vector embeddings on AI Core and SAP HANA Cloud vector engine.

An important distinction from using the Document Grounding Service compared to creating your own vector embeddings with the embedding client is that the Document Grounding Service is providing you with a HANA database and your own HDI container within it. That means you don't need your own SAP HANA Cloud instance which saves you not only money but also administration and operation time.

The API is creating a tenant and an HDI container for you and stores the created vector embeddings in the corresponding vector engine.

Let's take a look on how this is can be implemented.

👉 Within the `createDocument` function load the contextual text document from file:

```JavaScript
const loader = new TextLoader(path.resolve('db/data/demo_grounding.txt'));
const document = await loader.load();
```

👉 Right below, implement the call for creating a new collection. Make sure to replace the placeholder for the resource group with your name otherwise it won't be able to resolve the correct resource group:

```JavaScript
const response = await VectorApi.createCollection(
  {
    title: 'cap-ai-codejam-kr',
    embeddingConfig: {
      modelName: embeddingModelName
    },
    metadata: []
  },
  {
    'AI-Resource-Group': '<Your-Resource-Group>'
  }
).executeRaw();

```

This defines the configuration for the API to properly create a collection for you. As you can see, you are defining the embedding model you want to use.

Next, you need the collection ID so you can create the documents and store them in that collection.

👉 Implement the following line of code to retrieve the collection ID:

```JavaScript
const collectionId = response.headers.location.split('/').at(-2);
```

👉 Implement the creation of the document right below the previous line of code:

```JavaScript
const documentResponse = await VectorApi.createDocuments(
  collectionId,
  {
    documents: [
      {
        metadata: [],
        chunks: [
          {
            content: `${document}`,
            metadata: []
          }
        ]
      }
    ]
  },
  {
    'AI-Resource-Group': 'codejam-test'
  }
).execute();

return documentResponse.documents[0];
```

This API call uses the collection ID to lookup your collection and than takes the loaded document and stores it in the collection.

Now back to the `orchestrateJobPostingCreation`.

👉 In the `orchestrateJobPostingCreation` function, in the try block, create a new orchestration client passing in the required LLM, the template, and the filter:

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
http://localhost:4004/odata/v4/job-posting-servie/createJobPosting(user_query='Create a job posting for a Senior Software Developer.')
```

## Experiment with the orchestration service filters

You spend a lot of time implementing the code to get the orchestration service up and running. You have understood how the API works and how you can integrate it into a CAP application service.

At this point, I would encourage you to go back to the service implementation and play around with the different content filter options on the orchestration service. See how the filter level changes make the chat model respond differently. This will give you a better understanding on how you can utilize content filters to make sure that your AI services behave ethical.

## Summary

In this exercise you have implemented the job posting service and it's OData function handlers. You have utilized the SAP Cloud SDK for AI to connect to SAP AI Core via the orchestration service. You have connected to the orchestration deployment to ask a chat model to create a job posting for you.

At this point the chat model is not taking your company specific information into account. You need to change this to get proper job postings generated where the chat model knows about very specific information like pay ranges, job level, and other contextual information. To do so, you will utilize an Embedding model, vector embeddings and the SAP HANA Cloud Vector Engine.

## Further Reading

- [@sap-ai-sdk/orchestration - Documentation](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md)
- [Document Grounding - Documentation](https://github.com/SAP/ai-sdk-js/tree/main/packages/document-grounding)

---

[Next exercise](../12-data-masking-and-anonymization/README.md)
