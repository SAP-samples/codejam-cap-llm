# Exercise 07 - Create vector embeddings using an embedding model

In this exercise you will get a quick introduction to vector embeddings and you will learn:

- What vector embeddings are.
- How to create them.
- How to store them in the SAP HANA Cloud vector engine.

## What is a vector embedding?

AI models operate on data in a purely mathematical manner. An AI model by itself needs unstructured data such as text, audio or images be represented in a numerical way for it to operate on that data. To bridge the gap between unstructured data and the required numerical format for the AI model, the data must be converted to a numeric form. Vector embeddings are a way to represent unstructured data in a multi-dimensional numeric way for the AI model to process.

To perform this transformation an embedding model can be used. These embedding models can be pre-trained on a great number of data sets or you can utilize a model by training it yourself. In any case the embedding model creates an output vector representing unstructured data with the goal of meaningful similarity. That means the vector embedding should represent the semantic meaning of the real-world data. This allows for the mathematical assumption that two vector embeddings, which are similar to each other, have a high probability of being similar to their real-world data representation. The same is true for data that is dissimilar.

Using an embedding model to create vector embeddings, a numerical representation of real-world unstructured data, can help provide contextual information to an AI model that, based on that numerical data, can provide a proper answer to a user's question.

This is what you will do in the following exercises. You will use unstructured data, transform it into many vector embeddings, storing them in the SAP HANA Cloud vector engine. These vector embeddings than get compared to a vector embedding containing the user's questions using a mathematical algorithm. This comparison should return a vector embedding most similar to the numerical representation of the user's query. The resulting vector embedding's real-world data can now be used to provide contextual information to a chat model to retrieve a fitting answer to the user's query.

You can use two different algorithms for creating a comparison between vector embeddings:

- Euclidean distance measures the average linear distance between the different vectors.

- Cosine distance measures the cosine of the angle between two vectors. The result is between -1 and 1 whereas 1 represents complete similarity between two vectors, -1 the complete opposite and 0 that the two vectors are unrelated.

These two algorithms are different in the way of how they calculate the actual distance between two vectors. The closer the distance, the higher the probability of similarity.

If you are interested in the mathematical representation of these two algorithms, read an interesting article on the topic in the **Further Reading** section.

An easy approach to which algorithm to use is to simply try them both out and see what algorithm provides a better result.

## Define a simple OData endpoint to trigger the creation of vector embeddings

You will define two OData endpoints in the provided cds file. These two endpoints are provided to help you trigger the creation and deletion of vector embeddings during this workshop. You can definetely create vector embeddings outside of such a project and pre-populate your HANA database. This can be done via code or via the SAP generative AI Hub. For this workshop, I want you to do this on your own within this project so you get a good understanding on how this works.

👉 Open the [job-posting-service.cds](../../project/job-posting-service/srv/job-posting-service.cds) file.

You want to expose the entities `DocumentChunks` as well as the `JobPostings` via your OData service. To do so, you need a reference to the schema definition.

👉 Add the following line of code to create the reference to the schema definition:

```CDS
using {sap.codejam as db} from '../db/schema';
```

👉 Create the service definition:

```CDS
service JobPostingService { }
```

Within the service definition you want to expose the before-mentioned entities. The `DocumentChunks` entity has a field containing the actual embeddings. These embeddings are of type `cds.Vector`. The OData specification doesn't know the type `cds.Vector` and so can't expose it via the OData service. For some custom types defined by CDS it is possible to create a mapping to OData types, but not in this case. There is no corresponding OData type you could map `cds.Vector` to, that means you have to exclude this field from the OData service.

👉 Within the service definition, add an entity projection for `DocumentChunks`:

```CDS
entity DocumentChunks as
      projection on db.DocumentChunks
      excluding {
          embedding
      };
```

👉 Right below the `DocumentChunks` entity, add a projection for the `JobPostings` entity:

```CDS
entity JobPostings as projection on db.JobPostings;
```

Great! You got both entities projected in the OData service. Now, you implement two OData functions in your service. One for creation and one for the deletion of vector embeddings.

👉 Add two function definitions right below the `JobPostings` entity projection:

```CDS
function createVectorEmbeddings()                   returns String;
function deleteVectorEmbeddings()                   returns String;
```

## Implement the creation of vector embeddings

To achieve a more clean code structure, you will implement most of the business logic in separate files achieving separation of concerns. The separation will be treated lightly, so you will only create two separate files, one for handling all AI relevant tasks, and one for handling all database related tasks. The project provides you with the two files that are currently empty: `AIHelper` and `DBUtils`.

You will implement the function handlers, and you will call logic from within the `AIHelper` and the `DBUtils`. You will jump back and forth between these files to implement the needed business logic.

The SDK uses ES6 for module loading which means that you need to export the function implementations differently compared to what you are used to using CAP. For this Codejam, you can simply use the `export default function()` approach.

👉 Open the [job-posting-service.js](../../project/job-posting-service/srv/job-posting-service.js) file.

👉 First, import the `AIHelper` and `DBUtils` files to have access to the functions within. You will implement the functions step-by-step throughout the exercises:

```JavaScript
import * as AIHelper from './helper/ai-helper.js';
import * as DBUtils from './helper/db-utils.js';
```

👉 Add the following code block to the file:

```JavaScript
export default function () {
  // implementation goes here ...
}
```

👉 In the code block add the following function handlers:

```JavaScript
this.on('createVectorEmbeddings', async req => {
  // implementation goes here
});

this.on('deleteVectorEmbeddings', async req => {
  // implementation goes here
});
```

👉 In the `createVectorEmbeddings()` function, implement the following lines of code calling the creation of the vector embeddings from the `AIHelper` and store the result from this call in the database.

```JavaScript
const embeddings = await AIHelper.createVectorEmbeddings();
const embeddingEntries = await DBUtils.createEmbeddingEntries(embeddings);
await DBUtils.insertVectorEmbeddings(embeddingEntries);
return 'Vector embeddings created and stored in database';
```

Your function should look like this now:

```JavaScript
this.on('createVectorEmbeddings', async () => {
    const embeddings = await AIHelper.createVectorEmbeddings();
    const embeddingEntries = await DBUtils.createEmbeddingEntries(embeddings);
    await DBUtils.insertVectorEmbeddings(embeddingEntries);
    return 'Vector embeddings created and stored in database';
  });
```

👉 Implement the `deleteVectorEmbeddings` next:

```JavaScript
return await DBUtils.deleteVectorEmbeddings();
```

The function should look like this now:

```JavaScript
this.on('deleteVectorEmbedding', async () => {
  return await DBUtils.deleteVectorEmbeddings();
});
```

This code won't execute as of now, because the corresponding functions are not defined nor implemented in the AIHelper and DBUtils. You will do this now.

👉 Open the [ai-helper.js](../../project/job-posting-service/srv/helper/ai-helper.js).

Within the file you need to import the embedding client from the `@sap-ai-sdk/langchain` package.

👉 Add the following lines of code to the top of the file:

```JavaScript
import {
  AzureOpenAiEmbeddingClient,
} from '@sap-ai-sdk/langchain';
```

👉 Right below the import statement add the following constant containing the embedding model's name:

```JavaScript
const embeddingModelName = 'text-embedding-3-small';
```

You define the embedding model's name in a constant because you will use the name again at a later point. This gives you a single point of truth in case you want to change the chat model in the future.

👉 Do the same for the resource group:

```JavaScript
const resourceGroup = '<your-resource-group>';
```

To create vector embeddings, you need to read the contextual information file which in your case is a text document.

👉 Import a text loader from lanchain to read the needed document from file:

```JavaScript
import { TextLoader } from 'langchain/document_loaders/fs/text';
```

👉 Import the path tool to make definition of the file path easier:

```JavaScript
import path from 'path';
```

👉 Import a text splitter for splitting up the text document into meaningful chunks for the embedding model to process into vector embeddings:

```JavaScript
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
```

You have all the APIs imported to read a text file, split it into meaningful chunks and send it to the embedding model. You will implement the `createVectorEmbedding()` function now.

👉 Add the following asynchronous function `createVectorEmbedding()`:

```JavaScript
async function createVectorEmbeddings() {
  try {
    // implementation goes here...
  } catch (error) {
     console.log(
      `Error while creating Vector Embeddings.
      Error: ${error.response}`
    );
    throw error;
  }
}
```

👉 Within the try block implement the loading of the text document:

```JavaScript
const loader = new TextLoader(path.resolve('db/data/demo_grounding.txt'));
const document = await loader.load();
```

The code is using Langchain's text loader to load the `demo_grounding.txt` file.

With the file at hand you will define the text splitter and use it to split up the text within the text document into the specified sizes. The size of a text chunk is defined in characters using the specified text splitter. To find a working chunk size is not easy, it takes experience as well as testing. In case the size is set to high or to low, the embeddings might not be as usable as you want them to be. You can soften the result and make them more appliable to also set a chunk overlap.

👉 Right below the document loading call, add the initialization of the `RecursiveCharacterTextSplitter`:

```JavaScript
const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 70,
      chunkOverlap: 0,
      addStartIndex: true
});
```

👉 Call the `splitDocuments()` call with the loaded document:

```JavaScript
const splitDocuments = await splitter.splitDocuments(document);
```

The objects returned by the text splitter are JSON objects that hold values under the key `pageContent`. This value are the text chunks. You need to extract these values to pass them to the embedding client.

👉 Implement a simple array loop to extract the values:

```JavaScript
const textSplits = [];
for (const chunk of splitDocuments) {
  textSplits.push(chunk.pageContent);
}
```

You need a way to feed the document splits to the embedding model. If you remember, you've deployed an embedding model to SAP AI Launchpad. You will use this model to create the vector embeddings. SAP has provided you with the SAP Cloud SDK for AI that allows you to utilize Langchain APIs that has been enhanced with SAP functionality like connectivity to SAP AI Launchpad. You will create an `AzureOpenAiEmbeddingClient`instance which can automatically connect to SAP AI Launchpad using a service binding or the `.env` file.

👉 Create the embedding client by adding the following code:

```JavaScript
const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0,
      resourceGroup: resourceGroup
});
```

👉 Call the embedding client to embedd the document splits:

```JavaScript
const embeddings = await embeddingClient.embedDocuments(textSplits);
```

👉 Finally, return the embeddings, the document splits and the path. These values will be stored in the database in the `DocumentSplits` table. Add the following code:

```JavaScript
return [embeddings, splitDocuments];
```

Your complete implementation should look like this now:

```JavaScript
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
    console.log(
      `Error while creating Vector Embeddings.
      Error: ${error.response}`
    );
    throw error;
  }
}
```

👉 Lastly, add the `createVectorEmbeddings` to the function export as last line to the `ai-helper.js` file:

```JavaScript
export { createVectorEmbeddings};
```

## Implement the creation of vector embedding entries

You are about to implement the storing of the generated vector embeddings to the SAP HANA Cloud vector engine.

👉 Open the [db-utils.js](../../project/job-posting-service/srv/helper/db-utils.js) file.

👉 Add the following import statement to the top of the file:

```JavaScript
import cds from '@sap/cds';
```

👉 Add the following line of code to make SQL insert and delete querying available to you:

```JavaScript
const { INSERT, DELETE } = cds.ql;
```

👉 Add the following line of code to make the database entities available to you:

```JavaScript
const { JobPostings, DocumentChunks } = cds.entities;
```

To make your code easier to read, you will seperate the functionality of creating the embedding entries and the insertion to the database. You will utilize the `DocumentChunks` entity you have defined above to create the JSON object for database insertion.

👉 Define the `createEmbeddingEntries()` function:

```JavaScript
export function createEmbeddingEntries([embeddings, splitDocuments]) {
  // implementation goes here
}
```

👉 Within the function, define an array holding the different embedding entries:

```JavaScript
let embeddingEntries = [];
```

👉 Iterate over the embeddings and create a JSON object for each embedding in the list. Right below the previous line of code add the following:

```JavaScript
for (const [index, embedding] of embeddings.entries()) {
    const embeddingEntry = {
      metadata: splitDocuments[index].metadata.source,
      text_chunk: splitDocuments[index].pageContent,
      embedding: array2VectorBuffer(embedding)
    };
    embeddingEntries.push(embeddingEntry);
  }
```

👉 As last line of the `insertVectorEmbeddings` return the embedding entry list:

```JavaScript
return embeddingEntries;
```

As you might have noticed, you are calling a conversion function to convert the embeddings to a vector buffer for database insertion. This function needs to be implemented next.

👉 Below the `insertVectorEmbeddings` function implement the following:

```JavaScript
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
```

The complete `insertVectorEmbeddings` function should look like this:

```JavaScript
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
```

## Implement the insertion of the vector embedding entries

The insertion into the database is simple. You use the CAP CQL syntax to insert all entries to the `DocumentChunks` table.

👉 Create the function `insertVectorEmbeddings` first:

```JavaScript
export async function insertVectorEmbeddings(embeddingEntries) {
  try {
    // implementation goes here
  } catch (error) {
    console.log(
      `Error while storing the vector embeddings to SAP HANA Cloud: ${error.toString()}`
    );
    throw error;
  }
}
```

👉 Create the code the database insertion within the try block:

```JavaScript
await INSERT.into(DocumentChunks).entries(embeddingEntries);

return `Embeddings inserted successfully to table.`;
```

The `insertVectorEmbeddings` should look like this now:

```JavaScript
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
```

## Implement the deletion for the vector embeddings

You can create and insert vector embeddings, last step is to make it possible to delete vector embeddings.

👉 Right below the `insertVectorEmbeddings` function handler add the following code:

```JavaScript
export async function deleteVectorEmbeddings() {
  try {
    // implementation goes here
  } catch (error) {
    console.log(
      `Error while deleting Document Chunks: \n ${JSON.stringify(error.response)}`
    );
  }
```

👉 Within the `try` block add the following code:

```JavaScript
await DELETE.from(DocumentChunks);
return 'Successfully deleted Document Chunks!';
```

The `deleteVectorEmbeddings` should look like this now:

```JavaScript
export async function deleteVectorEmbeddings() {
  try {
    await DELETE.from(DocumentChunks);
    return 'Successfully deleted Document Chunks!';
  } catch (error) {
    console.log(
      `Error while deleting Document Chunks: \n ${JSON.stringify(error.response)}`
    );
  }
}
```

## Create some vector embeddings

At this point you have achieved a lot! You have defined and implemented not only the OData CAP service but also the database insertion and deletion. One thing you haven't done yet is test the code.

You will do this now!

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

Now, you will utilize the `cds watch --profile hybrid` command to run the project on localhost while establishing a real and live connection to the database. This is a way to speed up local development by working around the need of deployment to BTP.

👉 From the CLI run:

```Bash
cds watch --profile hybrid
```

Look at the console output! You can tell that it is running your project on localhost but also using the `cdsrc-private.json` to look up the binding to your HDI container within the SAP HANA Cloud instance. This look up is being used to establish a connection to the database.

👉 Open the localhost in a browser or use the prompt in Business Application Studio to directly open landing page.

![01_localhost.png](./assets/01_localhost.png)

From there you could access the database tables but you will see they are currently empty.

You can use the URL to call your OData function handler for creating the vector embeddings.

👉 Call the following URL: `http://localhost:4004/odata/v4/job-posting/createVectorEmbeddings()`

👉 Take a look at the console output. You can tell that the connection to AI Core has been established.

![02_ai_core_connection.png](./assets/02_ai_core_connection.png)

👉 Take a look at your browser window. You can see the success message you have implemented.

![03_success.png](./assets/03_success.png)

👉 You can go back to the `localhost:4004` service landing page and click on the `DocumentChunks` entity to load all entries from the database table.

![01_localhost.png](./assets/01_localhost.png)

![04_localhost_document_chunks.png](./assets/04_localhost_document_chunks.png)

## Summary

Congratulations! The call went through and apparently the vector embeddings were stored in the database. Wouldn't it be nice to have a certain way for checking the entries in the table?!

Remember the exercise where you used the `hana-cli` to do exactly that. Try this step on your own to use the CLI tool to check the database entries. If you need a quick recap, go back to [Exercise 06](../../exercises/06-define-db-schema/README.md) and check on the instructions.

### Questions for Discussion

1. How are vector embeddings created in the SAP HANA Cloud system?

<details><summary>Answer</summary>
Vector embeddings are created using an embedding model, which can either be pre-trained or trained by the user. The process typically involves the following steps:

- Load the unstructured data (e.g., text).
- Split the text into meaningful chunks.
- Feed these chunks into the embedding model to generate numerical vectors (embeddings).
- Store the embeddings in the SAP HANA Cloud vector engine for later use.

</details>

1. What are the two algorithms used to compare vector embeddings, and how do they differ?

<details><summary>Answer</summary>
The two algorithms used to compare vector embeddings are Euclidean Distance and Cosine Similarity.

- **Euclidean Distance** measures the average linear distance between two vectors. The closer the vectors, the more similar they are.

- **Cosine Similarity** calculates the cosine of the angle between two vectors, resulting in a value between -1 and 1. A cosine similarity of 1 indicates complete similarity, while -1 means complete dissimilarity, and 0 indicates no relationship. These algorithms differ in how they compute the "distance" or "similarity" between vectors, with cosine similarity being more sensitive to the direction of the vector rather than the magnitude.

</details>

## Further reading

- [SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js)
- [SAP Cloud Application Programming Model - Documentation](https://cap.cloud.sap/docs/)
- [CAP & Vector Embeddings](https://cap.cloud.sap/docs/guides/databases-hana#vector-embeddings)

---

[Next exercise](../08-define-job-posting-service/README.md)
