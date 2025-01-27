# Exercise 07 - Create vector embeddings using an embedding model

In this exercise you will get a quick introduction to vector embeddings and you will learn:

- What vector embeddings are.
- How to create them.
- How to store them in the SAP HANA Cloud vector engine.

## What is a vector embedding?

AI models operate on data in a purely mathematical manner. An AI model by itself needs unstructured data such as text, audio or images be represented in a numerical way for it to operate on that data. To bridge the gap between unstructured data and the required numerical format by the AI model is to convert the data to a numeric form. Vector embeddings are a way to represent unstructred data in a multi-dimensional numeric way for the AI model to process.

To perfom this transformation an embedding model can be used. These embeddings models can be pre-trained on a great number of data sets or you can utilize a model by training it yourself. In any case the embedding model creates an output vector representing unstructured data with the goal of meaningful similarity. That means the vector embedding should represent the semantic meaning of the real-world data. This allows for the mathematical assumption that two vector embeddings which are similiar to each other, have a high probability of being similiar to their real-world data representation. The same is true for data that is dissimiliar.

Using an embedding model to create vector embeddings, a numerical representation of real-world unstructured data, can help providing contextual information to an AI model performing, based on that numerical data, a proper answer to a user's question.

This is what you will do in the following exercises. You will use unstructured data, transform it into many vector embeddings, storing them in the SAP HANA Cloud vector engine. These vector embeddings than get compared to a vector embedding containing the user's questions using a mathematical algorithm. This comparisson should return a vector embedding most similiar to the numerical representation of the user's query. The resulting vector embedding's real-world data can now be used to provide contextual information to a chat model to retrieve a fitting answer to the user's query.

You can use two different algorithms for creating a comparisson between vector embeddings:

- Euclidian distance measures the average linear distance between the different vectors.

- Cosine distance measures the cosine of the angle between two vectors. The result is between -1 and 1 whereas 1 represents complete similarity between two vectors, -1 the complete opposite and 0 that two vectors are unrelated.

These two algorithms are different in the way of how they calculate the actual distance between two vectors. The closer the distance, the higher the probability of similarity.

If you are interested in the mathematical representation of these two algorithms, read an interesting article on the topic in the **Further Reading** section.

An easy approach to which algorithm to use is to simply try them both out and see what algorithm provides a better result.

## Define a simple OData endpoint to trigger the creation of vector embeddings

You will define two OData endpoints in the provided cds file. These two endpoints are simply there to make it easy for you to trigger the creation and deletion of vector embeddings during this workshop. You can definetely create vector embeddings outside of such a project and pre-populate your HANA database. This can be done via code or via the SAP generative AI Hub. For this workshop, I want you to do this on your own within this project so you get a good understanding on how this works.

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

To achieve a more clean code structure, you will implement most of the business logic in separate files achieving separation of concerns. The separation will be treated lightly so you will only create two separate files, one for handling all AI relevant tasks, and one for handling all database related tasks. The project provides you with the two files that are currently empty: `AIHelper` and `DBUtils`.

You will implement the function handlers, and you will call logic from within the `AIHelper` and the `DBUtils`. You will jump back and forth between these files to implement the needed business logic.

The SDK uses ES6 for module loading which means that you need to export the function implementations differently compared to what you are used to using CAP. For this Codejam, you can simply use the `export default function()` approach.

👉 Open the [job-posting-service.js](../../project/job-posting-service/srv/job-posting-service.js) file.

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

👉 In the `createVectorEmbeddings()` function, implement the following lines of code calling the creation of the vector embeddings from the `AIHelper` and the storing in the database for the result from this call.

```JavaScript
const embeddings = await AIHelper.createVectorEmbeddings();
const embeddingEntries = await DBUtils.createEmbeddingEntries(embeddings);
await DBUtils.insertVectorEmbedding(embeddingEntries);
return 'Vector embeddings created and stored in database';
```

Your function should look like this now:

```JavaScript
this.on('createVectorEmbeddings', async () => {
  await DBUtils.insertVectorEmbedding(await AIHelper.createVectorEmbedding());
  return 'Vector embeddings created and stored in database';
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
const embeddingModelName = 'text-embedding-ada-002';
```

You define the embedding model's name in a constant because you will use the name again at a later point. This gives you a single point of truth in case you want to change the chat model in the future.

👉 Do the same for the resource group:

```JavaScript
const resourceGroup = '<your-resource-group>';
```

👉 To use CDS methods import CDS:

```JavaScript
import cds from '@sap/cds';
```

👉 To have access to the Document Splits table, add the `DocumentChunks` constant:

```JavaScript
const { DocumentChunks } = cds.entities;
```

To create vector embeddings, you need to read the contextual information file which in your case is a text document.

👉 Import a text loader from lanchain to read the needed document from file:

```JavaScript
import TextLoader from 'langchain/document_loaders/fs/text';
```

👉 Import the path tool to make definition of the file path easier:

```JavaScript
import path from 'path';
```

👉 Import a text splitter for splitting up the text document into meaningful chunks for the embedding model to process into vector embeddings:

```JavaScript
import RecursiveCharacterTextSplitter from '@langchain/textsplitters';
```

You have all the APIs imported to read a text file, split it into meaningful chunks and send it to the embedding model. You will implement the `createVectorEmbedding()` function now.

👉 Add the following asyncrounos function `createVectorEmbedding()`:

```JavaScript
async function createVectorEmbeddings() {
  try {
    // implementation goes here
  } catch (error) {
    console.log(`Error while generating embeddings.
      Error: ${JSON.stringify(error.response)}`);
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

The objects you get back from the text splitter are JSON objects holding values behind the key `pageContent`. This value are the text chunks. You need to extract these values to pass them to the embedding client.

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
      resourceGroup: '<your-resource-group>'
});
```

👉 Call the embedding client to embedd the document splits:

```JavaScript
const embeddings = await embeddingClient.embedDocuments(documentSplits);
```

👉 Finally, return the embeddings, the document splits and the path. These values will be stored in the database in the `DocumentSplits` table. Add the following code:

```JavaScript
return [embeddings, splitDocuments];
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

👉 Finally, return the embedding entry list:

```JavaScript
return embeddingEntries;
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

## Create some vector embeddings

