# Exercise 09 - Implement the Job Posting Service

This exercise will help you understand how a typical RAG flow looks like and you will implement that using the SAP Cloud SDK for AI's langchain package.

In this exercise, you will learn the following:

- How to implement OData function handlers.
- How to execute a RAG flow using the SAP Cloud SDK for AI Langchain package.
- How to insert database entries to the SAP HANA Cloud vector engine.

## Implement the OData function handler for the RAG execution

👉 Open the [job-posting-service.js](../../project/job-posting-service/srv/job-posting-service.js) file.

👉 In the `export function` code block, right below the embedding code, add the following function handlers:

```JavaScript
this.on('executeJobPostingRAG', async req => {
    // implementation goes here ...
});

this.on('deleteJobPosting', async req => {
    // implementation goes here ...
 });

this.on('deleteJobPostings', async () => {
    // implementation goes here ...
 });
```

## Implement input parameter validation

For both, the creation of a job posting and the deletion of a specific job posting, the API requires input parameters for the user query or the job id. These values need to be checked if they are `undefined` or `empty` to prevent runtime errors. You will implement a simple method checking these values and in case of an unwanted value throw an error.

👉 Below the closing curly bracket of the function export add the following method declaration:

```JavaScript
function validateInputParameter(parameter) {
    // implementation goes here
}
```

Now, you will implement a check for `undefined` and a check for an empty String.

👉 In the method add the following lines of code:

```JavaScript
if (typeof parameter === 'undefined') {
    throw new Error(wrongInputError);
}

function isEmpty(input) {
    return input.trim() === '';
}

if (isEmpty(parameter)) {
    throw new Error(wrongInputError);
}
```

Your method should look like this now:

```JavaScript
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
```

## Implement the RAG execution

With the input validation in place, you can go ahead and implement the RAG flow. Before you do that, think about what should happen.

1. A user inputs a query describing what kind of job posting should be created.
2. Your OData service takes the input and passes it through to the OData function handler for the RAG execution.
3. The user query needs to be sent to an embedding client to get a vector for that user query. This is required to execute the similarity search on the already embedded vector embeddings in the SAP HANA Cloud vector engine. You will use the cosine similarity algorithm.
4. A chat client establishes connection to a specific chat model, for this Codejam you will use the `gpt-4o-mini`.
5. The vector of the user query together with the query, gets send to the chat model using a template giving extra context, to the chat model.
6. The chat model processes the request and returns a response to your client.
7. The response gets passed to the `DBUtils` to create a new database entry.
8. The entry then gets inserted into the database with the help of CQL.

To be fair, this seems like a lot but no worries it is actually not that bad. Let's go through it step-by-step.

👉 Within the `executeJobPostingRAG` function handler retrieve the user query from the request and pass it to the input validation method you've implemented before:

```JavaScript
const user_query = req.data.user_query;
validateInputParameter(user_query);
```

You will call methods you haven't implemented yet, but no worries you will gradualiy build up the logic.

👉 Right below the input validation within the `executeJobPostingRAG` method, call the following code:

```JavaScript
let entry = await DBUtils.createJobPosting(
    await AIHelper.executeRAG(user_query)
);
```

This code is calling the RAG flow implementation (Step 2-6) The result of this gets passed to the `DBUtils` to create a new database entry (Step 7).

The last step is to insert the database entry into the database (Step 8).

👉 Insert the following code as the last line to the `createJobPosting` method:

```JavaScript
await DBUtils.insertJobPosting(entry);
return 'Job posting created and stored in database';
```

Your method should look like this now:

```JavaScript
this.on('executeJobPostingRAG', async req => {
    const user_query = req.data.user_query;
    validateInputParameter(user_query);

    let entry = await DBUtils.createJobPosting(
        await AIHelper.executeRAG(user_query)
    );
    await DBUtils.insertJobPosting(entry);
    return 'Job posting created and stored in database';
});
```

### Implement the RAG flow in the AIHelper

👉 Open the [AIHelper](../../project/job-posting-service/srv/helper/ai-helper.js) file.

Within the file you need to import the chat client from the `@sap-ai-sdk/langchain` package.

👉 Add the `AzureOpenAIChatClient` to the import statement:

```JavaScript
import {
  AzureOpenAiEmbeddingClient,
  AzureOpenAiChatClient
} from '@sap-ai-sdk/langchain';
```

👉 Right below the import statement add the following constant containing the chat model's name:

```JavaScript
const chatModelName = 'gpt-4o-mini';
```

You define the chat model's name in a constant because you will use the name again at a later point. This gives you a single point of truth in case you want to change the chat model in the future.

👉 Add the `executeRAG` method you have also called in the `job-posting-service.js` OData function handler:

```JavaScript
async function executeRAG(user_query) {
  try {
    // implementation goes here
  } catch (error) {
    console.log(`Error while executing RAG.
      Error: ${JSON.stringify(error.response)}`);
    throw error;
  }
```

Within the `try` block, you will add the complete logic for the RAG flow. You will start by implementing the creation of the vector embedding for the given user query. This is necessary for the similarity search using the cosine similarity algorithm.

👉 Initialize an embedding client for the `text-embedding-ada-002` model:

```JavaScript
const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0,
      resourceGroup: '<your-resource-group>'
    });
```

Embedding the user query will allow for the creation of a vector embedding. The vector embedding can then be used to calculate the closest distance to existing contextual vector embeddings in the SAP HANA Cloud vector engine. The result of this is that you will receive the contextual vector embedding with the highest relevance to the user query. This embedding can then be send to the chat model as contextual information to answer the user query.

👉 Embedd the user query with the embedding client:

```JavaScript
let embedding = await embeddingClient.embedQuery(user_query);
```

👉 Execute the cosine similarity using a `SELECT` statement and ordering the result using the cosine similarity for the given vector of the user query:

```JavaScript
let splits = await SELECT.from(DocumentChunks)
      .orderBy`cosine_similarity(embedding, to_real_vector(${embedding})) DESC`;
```

👉 Extract the first result from the list `splits`:

```JavaScript
let text_chunk = splits[0].text_chunks;
```

You have all relevant information at hand to construct the template which is getting send to the chat model.

👉 Create a message template for the chat model:

```JavaScript
const message = {
      role: 'user',
      content: [
        {
          type: 'text',
          text:
            ` You are an assistant for HR recruiter and manager.
            You are receiving a user query to create a job posting for new hires.
            Consider the given context when creating the job posting to include company relevant information like pay range and employee benefits.
            Consider all the input before responding.
            context: ${text_chunk}` + user_query
        }
      ],
      context: text_chunk
    };
```

A typical message to a chat model requires a couple of information. First of all, you need to specify if you are sending a user message or a system message. In your case, you are constructing a user message and you enhance the user message with additional contextual information and instructions. You add the user query to the instructions for the model to give a better response. To the user, this additional information is hidden so they can focus on their request.

👉 With the message constructed, create a chat client using the `gpt-4o-mini` model:

```JavaScript
const chatClient = new AzureOpenAiChatClient({
      modelName: chatModelName,
      maxRetries: 0,
      resourceGroup: '<your-resource-group>'
    });
```

👉 Send the message to the chat model via the chat client:

```JavaScript
let ragResponse = await chatClient.invoke([message]);
```

Finally, return the user query as well as the chat model's response to be further processed and inserted into the database.

👉 Add the following line of code as the last line of code in the `try` block:

```JavaScript
return [user_query, ragResponse.content];
```

The complete implementation of the `executeRAG` should look like this now:

```JavaScript
async function executeRAG(user_query) {
  try {
    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0,
      resourceGroup: '<your-resource-group>'
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
          text:
            ` You are an assistant for HR recruiter and manager.
            You are receiving a user query to create a job posting for new hires.
            Consider the given context when creating the job posting to include company relevant information like pay range and employee benefits.
            Consider all the input before responding.
            context: ${text_chunk}` + user_query
        }
      ],
      context: text_chunk
    };

    const chatClient = new AzureOpenAiChatClient({
      modelName: chatModelName,
      maxRetries: 0,
      resourceGroup: '<your-resource-group>'
    });

    let ragResponse = await chatClient.invoke([message]);

    return [user_query, ragResponse.content];
  } catch (error) {
    console.log(`Error while executing RAG.
      Error: ${JSON.stringify(error.response)}`);
    throw error;
  }
}
```

### Create a job posting entry

You want to save the response from the chat model to the HANA database to display it in a UI or further process it. CAP allows us to do that using the [CDS Query Language (CQL)](https://cap.cloud.sap/docs/cds/cql). The CQL gives us a nice tool to write SQL-like syntax to execute CRUD operations and more.

Before you can write anything to the database you want to create a database entry object based on the table you want to add data to. For the job posting response, you want to use the `JobPostings` table, and so for want to create an entry matching the fields of that table's entity.

If you look into the [schema.cds](../../project/job-posting-service/db/schema.cds) file, you can inspect the fields of a job posting entry:

```CDS
entity JobPostings : cuid, managed {
    user_query   : String;
    rag_response : String;
}
```

You need to create an object containing a String for the user query and a String for the response of the chat model.

👉 Open the [db-utils.js](../../project/job-posting-service/srv/db-utils.js) file and add the following lines of code to define the creation of a Job Posting database entry. Add the lines of code right below the existing code for the embedding insertion and deletion:

```JavaScript
export function createJobPosting([userQuery, ragResponse]) {
    // implementation goes here
}
```

👉 Within the `createJobPosting` method, add code to instantiate a new entry object filling the required fields, and return the entry:

```JavaScript
const entry = {
    user_query: userQuery,
    rag_response: ragResponse
};
return entry;
```

Your method should look like this:

```JavaScript
export function createJobPosting([userQuery, ragResponse]) {
  const entry = {
    user_query: userQuery,
    rag_response: ragResponse
  };
  return entry;
}
```

### Insert the job posting entry into the HANA database

Now that you have a way to create new database entries for job postings, you can implement a new method for inserting such an entry to the HANA database table.

👉 Right below the `createJobPosting` method add a new method declaration:

```JavaScript
export async function insertJobPosting(jobPosting) {
  try {
    // implementation goes here
  } catch (error) {
    console.log(
      `Error while storing the Job Posting to SAP HANA Cloud. \n ${JSON.stringify(error.response)}`
    );
    throw error;
  }
}
```

👉 In the `try` block add the insert logic:

```JavaScript
await INSERT.into(JobPostings).entries(jobPosting);
return 'Job Posting inserted successfully to table.';
```

Your method should look like this now:

```JavaScript
export async function insertJobPosting(jobPosting) {
  try {
    await INSERT.into(JobPostings).entries(jobPosting);
    return 'Job Posting inserted successfully to table.';
  } catch (error) {
    console.log(
        `Error while storing the Job Posting to SAP HANA Cloud. \n ${JSON.stringify(error.response)}`
    );
    throw error;
  }
}
```

### Implement the deletion of job postings

You have a way to insert job posting entries to the HANA database, but you don't have a way to delete them.
In this section you will implement two ways of deleting the job postings, one where you can delete a specific job posting by passing in the id and one where you delete all job postings from the table.

👉 Below the `insertJobPosting` method, add a new method:

```JavaScript
export async function deleteJobPosting(withID) {
    try {
        // implementation goes here
    } catch (error) {
        console.log(
            `Error while deleting Job Posting with ID: ${withID} because: \n ${JSON.stringify(error.response)}`
        );
        throw error;
    }
}
```

👉 In the try block add the following code for deleting a job posting by id:

```JavaScript
await DELETE.from(JobPostings).where(JobPostings.id == withID);
return `Successfully deleted Job Posting with ID: ${withID}`;
```

Your method looks like that now:

```JavaScript
export async function deleteJobPosting(withID) {
  try {
    await DELETE.from(JobPostings).where(JobPostings.id == withID);
    return `Successfully deleted Job Posting with ID: ${withID}`;
  } catch (error) {
    console.log(
      `Error while deleting Job Posting with ID: ${withID} because: \n ${JSON.stringify(error.response)}`
    );
    throw error;
  }
}
```

To delete all job postings from the table insert the following method. You are not going into detail here because the deletion of all entries is fairly simple:

```JavaScript
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
```

## Try out your API

Wow! You did a great job so far and you have implemented a lot of code doing a lot of things.
What you need to do now is play around with your API.

You will utilize the `cds watch --profile hybrid` command again to run your service locally and test the different calls in your browser via localhost.

The interesting part is that the chat model is using the previously created vector embeddings to answer the user's requests. That being said, try out different prompts and see how the model behaves. It should include the information you have provided through the vector embeddings.

👉 Open a new terminal if not already open.

👉 Make sure that you are still connected to the Cloud Foundry instance by checking the connection details:

```bash
cf target
```

If the reply from the CLI tells you to log in again simply enter `cf login`.

```bash
cf login
```

👉 Build the project first by calling the `cds build --production` command.

```bash
cds build --production
```

👉 From the CLI run:

```Bash
cds watch --profile hybrid
```

You can use the different API endpoints now:

**Create a Job Posting**

You can change the user query to whatever you want.

```Bash
http://localhost:4004/odata/v4/job-posting/executeJobPostingRAG(user_query='Createa%20Job%20Posting%20for%20a%20Senior%20Developer')
```

**Delete Job Postings**

```Bash
http://localhost:4004/odata/v4/job-posting/deleteJobPostings()
```

**Delete a specific Job Posting**

The specific job posting ID can be found in the Job Postings table in case you have created a job posting.

```Bash
http://localhost:4004/odata/v4/job-posting/deleteJobPosting(id='<specify-job-posting-id>')
```

## Summary

In this exercise you have implemented the job posting service and it's OData function handlers. You have utilized the SAP Cloud SDK for AI to connect to SAP generative AI Hub. You have connected to the embedding model to create a vector embedding for the user query and executed a similarity search on the SAP HANA Cloud vector engine. You have constructed a message using the user query and the contextual information from the SAP HANA Cloud vector engine. Finally, you have sent the message to the chat client and processed the result in order to write it to the database and make the created job posting available to the user.

## Further Reading

- [Query Language (CQL)](https://cap.cloud.sap/docs/cds/cql)
- [@sap-ai-sdk/langchain - Documentation](https://github.com/SAP/ai-sdk-js/blob/main/packages/langchain/README.md)
- [CAP - Actions & Functions](https://cap.cloud.sap/docs/guides/providing-services#actions-functions)
- [SAP HANA Cloud Vector Engine: Quick FAQ Reference](https://community.sap.com/t5/technology-blogs-by-sap/sap-hana-cloud-vector-engine-quick-faq-reference/ba-p/13675212)
- [Cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity)

---

[Next exercise](../10-understand-and-deploy-orchestration-model/README.md)