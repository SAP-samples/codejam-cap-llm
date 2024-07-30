# 08 - Implement the embedding service

The embedding service has a service definition that allows CAP to produce an OData service API for the `DocumentChunk` entity and two exposed functions `storeEmbeddings()` and `deleteEmbeddings()`. In this exercise you will learn how to implement both of these functions by using libraries like [langchain](https://www.npmjs.com/package/@langchain/core), and the [CAP-LLM-Plugin](https://www.npmjs.com/package/cap-llm-plugin).

In this exercise you will learn:

* How to implement a service definition using Node.js.
* How to process text for creation of vector embeddings using an embedding model.
* How to use the CAP-LLM-Plugin to create vector embeddings using the SAP generative AI Hub.

## Implement the embedding service

The embedding service implementation contains of two function implementations `storeEmbeddings()` and `deleteEmbeddings()`. Both functions are using a set of helper methods taking care of single tasks to keep a cleaner code base.

For a successful implementation you are going to use different packages providing functionality required to perform the tasks you want to accomplish.

Let's take a look at the used packages:

* `PDFLoader`                       : The Langchain npm package provides different types of document loaders. Because the embedding document is a PDF, you will use the PDF loader to do so.
* `RecursiveCharacterTextSplitter`  : The Langchain npm package provides different types of text splitters. Text splitters allow you to perform chunking of document containing text. Splitting the text into chunks allows for fine granular creation of vector embeddings using an embedding model. The recursive character text splitter is one of the most frequently used text splitters available.
* `cds.ql`                          : The Core Data Service package includes the query language package. From that package you will use the insert and delete API to operate on the database.
* `path`                            : The path API allows f

### Implement the package imports and function export skeleton

👉 Open SAP Business Application Studio or your local VSCode instance.

👉 Under the `/srv` directory, create a new file `embedding-storage.js`.

👉 Open the file and add the following properties to it:

```JavaScript
const cds = require('@sap/cds')
const { INSERT, DELETE } = cds.ql
const { PDFLoader } = require('langchain/document_loaders/fs/pdf')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const path = require('path')
const filePath = 'db/data/CAP_Documentation_V8.pdf'
```

This code gives you instances for the above described packages and it defines the file path to the context information document.

👉 Below the constants add the following code:

```JavaScript
module.exports = function() {

}
```

Within the function export, the curly brackets, you will implement the `storeEmbeddings()` and `deleteEmbeddings()` function handlers. CAP allows you to write custom function handlers for defined OData functions. You can find more information about function handlers in the [Further Reading]() section.

### Implement the deleteEmbeddings()

The `deleteEmbeddings()` function is responsible for deleting all embeddings stored in the database. For that you will access the `DocumentChunk` entity and delete all entries from the database table using the CAP query language.

You will implement the function handler within the block of the function export.

👉 Add the following code within the curly brackets of the function export:

```JavaScript
this.on ('deleteEmbeddings', async (req) => {
// ...
})
```

This line of code defines a handler for the `deleteEmbeddings` OData function defined in the [embedding-storage.cds](../../project/cap-documentation-ai-helper/srv/embedding-storage.cds). When you call that function via a given API, the code within the block will be executed.

👉 Add the following lines of code to the `deleteEmbeddings`:

```JavaScript
try {
    // Delete any previous records in the table
    const { DocumentChunk } = this.entities
    await DELETE.from(DocumentChunk)
    return "Success!"
}
catch (error) {
    // Handle any errors that occur during the execution
    console.log('Error while deleting the embeddings content in db:', error)
    throw error
}
```

👉 Safe the file.

To test the implementation you can execute the `cds watch` command and run localhost.

👉 Open a new terminal or use an existing one.

👉 Execute the `cds watch` command using the hybrid profile to try out the `deleteEmbeddings()` function.

👉 You can call the `deleteEmbeddings()` function by calling the following URL `http://localhost:4004/odata/v4/embedding-storage/deleteEmbeddings()`.

> In case you are running into an error, log into the Cloud Foundry account again using `cf login`.

![implement-embedding-service-delete-embeddings-call](./assets/01-implement-embedding-service-delete-embeddings-call.png)

### Implement the storeEmbeddings()

The `storeEmbeddings()` function does quite some heavy lifting. It is responsible for processing the context information document, retrieving the vector embeddings, and storing the results in the HANA database.

You will implement the function handler in a way that it is solely responsible for storing the vector embeddings to the database. All the other tasks will be extracted into single method implementations. That gives you a better separation of concerns.

Now think what methods are necessary to implement:

* A method responsible for loading the context information document. The document is of type PDF. You will call that method `loadPDF(fromFilePath)`.
* A method responsible for chunking the context information document. The method expects a document. You will call that method `chunk(pdf)`.
* A method responsible for using the CAP-LLM-Plugin to establish connection to SAP generative AI hub and the embedding model. The CAP-LLM-Plugin call is not only establishing a backend connection but also constructs the HTTP request and sends it to the embedding model using the destination configuration. You will call that method `retrieveEmbeddings(forChunks)`.
* A method to convert the vector embeddings data for storing them in the HANA database. You will call the method `array2VectorBuffer`.
* A method to handle the OData function call. It's sole purpose is to call the helper methods and store the results in the HANA database. The method is being called `storeEmbeddings()`.

#### Implement the loadPDF(fromFilePath) method

👉 Add the following method declaration, right below the function export `module.exports = function() { ... }`:

```JavaScript
async function loadPDF(fromFilePath) { }
```

👉 In the block of the method, initialize a `PDFLoader(filePath)` and subsequently call `load()` on the object:

```JavaScript
const loader = new PDFLoader(fromFilePath)
const document = await loader.load()
```

👉 Return the document:

```JavaScript
return document
```

The complete method implementation looks like the following:

```JavaScript
async function loadPDF(fromFilePath) {
    const loader = new PDFLoader(fromFilePath)
    const document = await loader.load()
    return document
}
```

### Implement the chunk(pdf) method

👉 Add the following method declaration, right below the `loadPDF(fromFilePath)` method:

```JavaScript
async function chunk(pdf) { }
```

Initialize a `RecursiveCharacterTextSplitter` object from the Langchain package. The initializer expects the chunking configuration. That configuration decides on how the text splitter is executing the chunking.

👉 In the block of the method, initialize a `RecursiveCharacterTextSplitter(chunkSize, chunkOverlap, separators)`:

```JavaScript
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
    separators: ["."]
})
```

The splitter is using punctuation to separate the chunks. The chunk size is set to 500 in that case.

👉 Execute the chunking by calling the `splitter.splitDocuments(document)` method:

```JavaScript
const textChunks = await splitter.splitDocuments(pdf)
console.log(`Documents split into ${textChunks.length} chunks.`)
```

👉 Return the text chunks:

```JavaScript
return textChunks
```

The complete method implementation looks like the following:

```JavaScript
async function chunk(pdf) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
    separators: ["."]
  })
    
  const textChunks = await splitter.splitDocuments(pdf)
  console.log(`Documents split into ${textChunks.length} chunks.`)
  return textChunks
}
```

### Implement the array2VectorBuffer(data) method

To convert the vector embeddings data to a format that is storable in the SAP HANA Cloud vector engine, you implement a helper method.

👉 Add the following method declaration, right below the `chunk(pdf)` method:

```JavaScript
function array2VectorBuffer(data) { }
```

👉 Add properties to the method used for calculating the buffer size:

```JavaScript
const sizeFloat = 4
const sizeDimensions = 4
const bufferSize = data.length * sizeFloat + sizeDimensions
```

👉 Allocate a buffer using the above calculated buffer size. You will write the values into that buffer stream after.

```JavaScript
const buffer = Buffer.allocUnsafe(bufferSize)
```

👉 Iterate over the vector embeddings data array. For each value do a conversion and write it to the buffer stream:

```JavaScript
buffer.writeUInt32LE(data.length, 0)
data.forEach((value, index) => {
    buffer.writeFloatLE(value, index * sizeFloat + sizeDimensions);
})
```

👉 Return the buffer:

```JavaScript
return buffer
```

The complete method implementation looks like the following:

```JavaScript
function array2VectorBuffer(data) {
  const sizeFloat = 4
  const sizeDimensions = 4
  const bufferSize = data.length * sizeFloat + sizeDimensions

  const buffer = Buffer.allocUnsafe(bufferSize)
  
  buffer.writeUInt32LE(data.length, 0)
  data.forEach((value, index) => {
    buffer.writeFloatLE(value, index * sizeFloat + sizeDimensions);
  })
  return buffer
}
```

### Implement the retrieveEmbeddings(forChunks) method

If you remember the presentation in the beginning, the Advocate showed you an overview of the available APIs provided by the CAP-LLM-Plugin. One of those API methods is for retrieving the vector embeddings for a given text chunk. If the `vectorPlugin.getEmbedding()` call gets executed the plugin looks up the connection configuration, constructs the HTTP request and sends that via the destination to the SAP generative AI Hub. The request is being forwarded from SAP to the partner embedding model for creating the vector embeddings.

The plugin requires additional configuration to know what destination to use and what embedding model to connect to. This configuration will be created by you in the next exercise.

👉 Add the following method declaration, right below the `array2VectorBuffer(data)` method:

```JavaScript
async function retrieveEmbeddings(forChunks) { }
```

👉 In the method's block add the connection to the CAP-LLM-Plugin:

```JavaScript
console.log("Connecting to the CAP-LLM-Plugin...")
const vectorPlugin = await cds.connect.to('cap-llm-plugin')
```

👉 Implement an array for storing the text chunk entries that will subsequently inserted into the database:

```JavaScript
let textChunkEntries = []
```

👉 Iterate over the passed in chunks, call the `getEmbedding()` method to retrieve the vector embeddings for each chunk, and create the database entry:

```JavaScript
console.log("Generating the vector embeddings for the text chunks.")
for (const chunk of forChunks) {
    const embedding = await vectorPlugin.getEmbedding(chunk.pageContent)
    const entry = {
        "text_chunk": chunk.pageContent,
        "metadata_column": filePath,
        "embedding": array2VectorBuffer(embedding)
    }
    console.log(entry)
    textChunkEntries.push(entry)
}
```

👉 Return the entries:

```JavaScript
return textChunkEntries
```

### Implement the function handler for the storeEmbeddings OData function

You have implemented all required helper methods as well as the creation of the text chunk entries for instering `DocumentChunk` entities to the database.

👉 To implement the function handler for the `storeEmbeddings` OData function, add the following lines of code to the `module.exports = function() { }`:

```JavaScript
this.on('storeEmbeddings', async (req) => {
    try {

    } catch (error) {

    }
})
```

👉 Load the context information document from the file system. Within the `try` block call the `loadPDF(fromFilePath) helper method:

```JavaScript
const pdf = await loadPDF(path.resolve(`${filePath}`))
```

👉 Call the `chunk(pdf)` method to chunk the loaded PDF document.

```JavaScript
const textChunks = await chunk(pdf)
```

👉 Create the vector embeddings from the text chunks by calling the `retrieveEmbeddings(forChunks)` method:

```JavaScript
const textChunkEntries = await retrieveEmbeddings(textChunks)
```

👉 Insert the text chunk entry object into the `DocumentChunk` table of the database:

```JavaScript
console.log("Inserting text chunks with embeddings into db.")
const { DocumentChunk } = this.entities
const insertStatus = await INSERT.into(DocumentChunk).entries(textChunkEntries)
if (!insertStatus) {
  throw new Error("Insertion of text chunks into db failed!")
}
return `Embeddings stored successfully to table.`
```

👉 The database insert can throw and error. Within the `catch(error)` block implement the following error handling:

```JavaScript
console.log('Error while generating and storing vector embeddings:', error)
throw error
```

> The error handling you are implementing here is by far not suited for productive use. In production code implement proper error handling rather than throwing the error.

👉 Save the file.

## Summary

At this point the `storeEmbeddings` would run into an error if being executed because the CAP-LLM-Plugin does not yet know what destination it should uses for connecting against SAP generative AI Hub. In the next exercise you will adapt the `cdsrc-private.json` to include CAP-LLM-Plugin specific configuration.

## Further Reading

*[CAP-LLM-Plugin - getEmbedding API Doc](https://github.com/SAP-samples/cap-llm-plugin-samples/blob/main/docs/api-documentation.md#async-getembeddinginput)
*[Providing Services - Actions&Functions](https://cap.cloud.sap/docs/guides/providing-services#actions-functions)
*[Document Loaders - PDF](https://js.langchain.com/v0.1/docs/modules/data_connection/document_loaders/pdf/)
*[Recursevly Split by Characters](https://js.langchain.com/v0.1/docs/modules/data_connection/document_transformers/recursive_text_splitter/)
* [Error Handling CAP](https://cap.cloud.sap/docs/node.js/best-practices#error-handling)

---

## Questions

If you finish earlier than your fellow participants, you might like to ponder these questions. There isn't always a single correct answer and there are no prizes - they're just to give you something else to think about.

---

[Next exercise](../09-create-connection-configuration/README.md)