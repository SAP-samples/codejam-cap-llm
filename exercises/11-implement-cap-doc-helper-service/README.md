# Exercise 11 - Implement the CAP documentation helper service

Implementing the CAP documentation helper service follows the same principle as the embedding storage service. You are using the `module.exports = function() { }` to expose the function handlers.

You must implement the function handlers for:

* `getRagResponse()` and
* `executeSimilaritySearc
Both methods require information on:
* The time: The table name is the name of the `SAP_CODEJAM_DOCUMENTCHUNK` table.
* The embedding column                      : The embedding column is defined in the database schema. `EMBEDDING`.
* The content column                        : The content column is defined in the database schema. `TEXT_CHUNK`.
* A defined user query                      : The query is usually transmitted through a UI or API parameter. For this CodeJam, it is hard coded.
* (Optional) instructions for the chat model: A chat model can receive instructions on answering the user query. You could tell it to respond by speaking like a pirate *Arrr* 🏴‍☠️.

In this exercise, you will learn the following:

* How to retrieve an RAG response using the CAP-LLM-Plugin?
* How to execute a similarity search using the CAP-LLM-Plugin.

## Define the needed properties

You will implement properties in a new file storing the required information by the CAP-LLM-Plugin.

👉 Open BAS or your local VSCode instance.

👉 Create a new file in the `srv` folder and name it `cap-documentation-service.js`.

👉 Open the file.

👉 Create the following properties:

```JavaScript
const cds = require('@sap/cds')
const tableName = 'SAP_CODEJAM_DOCUMENTCHUNK'
const embeddingColumn = 'EMBEDDING'
const contentColumn = 'TEXT_CHUNK'
const userQuery = Explain to me what CAP is.' //You can change this.
const instructions = 'Return the result in json format.' //You can change this.
```

👉 Save the file.

## Implement the getRagResponse() function handler

When called, the `getRagResponse` method reaches out to the SAP gen AI Hub and asks a given user query to the chat model. The chat model responds with an answer. By using RAG, the chat model gets additional contextual information.

👉 Below the properties, implement the `module.exports = function() { }`:

```JavaScript
module.exports = function() {
    // function handlers go here
}
```

👉 Create the function handler:

```JavaScript
this.on('getRagResponse', async () => {
        try {
            
        } catch (error) {
            console.log('Error while generating response for user query:', error)
            throw error;
        }
    })
```

👉 In the `try` block, create a connection to the CAP-LLM-Plugin:

```JavaScript
const vectorplugin = await cds.connect.to('cap-llm-plugin')
```

👉 Below that, call the `getRagResponse()` using the CAP-LLM-Plugin:

```JavaScript
const ragResponse = await vectorplugin.getRagResponse(
    userQuery,
    tableName,
    embeddingColumn,
    contentColumn
)
```

The call requires the information defined in the properties. If these values ever change you can adjust the properties.

👉 Return the response:

```JavaScript
return ragResponse
```

Your function handler should look like this:

```JavaScript
this.on('getRagResponse', async () => {
    try {
        const vectorplugin = await cds.connect.to('cap-llm-plugin')
        const ragResponse = await vectorplugin.getRagResponse(
            userQuery,
            tableName,
            embeddingColumn,
            contentColumn
        )
        return ragResponse
    } catch (error) {
        console.log('Error while generating response for user query:', error)
        throw error;
    }
})
```

## Test the getRagResponse() OData function

The function handler is fully implemented, and you can start the application locally using the actual connections to SAP generative AI Hub and SAP HANA Cloud to test a RAG response call. You should have vector embeddings in the database that will be used by the CAP-LLM-Plugin. If you tried out the `deleteEmbeddings()` call, create new vector embeddings using the `storeEmbeddings()` call.

👉 Start the CAP application using `cds watch --profile hybrid`.

👉 Open the service UI via `http://localhost:4040/`.

👉 Call the `getRagResponse()` function via the API URL `http://localhost:4004/odata/v4/capdocumentation/getRagResponse()`

![Insert Image]()

👉 Take a look in the terminal to observe what the call does in detail.

![Insert Image]()

👉 Check the response to see if the chat model returns any hallucinations.

> In case of hallucinations, you must double-check the context information to see if the requested response can be answered due to potential missing details. Add the data to the context information or provide a second document if the data is missing. If that is not the issue, you might have to play around with the chunking until you get satisfying results. AI is intelligent but can only answer correctly if the contextual information is appropriately provided.

## Implement the executeSimilaritySearch() function handler

The similarity search is used for searching objects where the only available comparator is the similarity between two objects. The CAP-LLM-Plugin provides an API for this; `similaritySearch()`.

You will implement the function handler responsible for executing the similarity search of embeddings matching the user query. 

👉 Below the `getRagResponse()` function handler, add another function handler:

```JavaScript
this.on('executeSimilaritySearch', async () => {
    try {
    // implementation goes here
    } catch (error) {
        console.log('Error while executing similarity search:', error)
        throw error;
    }
})
```

👉 In the `try` block, connect to the CAP-LLM-Plugin:

```JavaScript
const vectorplugin = await cds.connect.to('cap-llm-plugin')
```

👉 Retrieve the vector embeddings for the given user query:

```JavaScript
const embeddings = await vectorplugin.getEmbedding(userQuery)
```

👉 Execute the similarity search using the CAP-LLM-Plugin:

```JavaScript
const similaritySearchResults = await vectorplugin.similaritySearch(
    tableName,
    embeddingColumn,
    contentColumn,
    embeddings,
    'L2DISTANCE',
    3
)
```

If you look into the API documentation for the [similarity search](https://github.com/SAP-samples/cap-llm-plugin-samples/blob/main/docs/api-documentation.md#async-similaritysearchtablename-embeddingcolumnname-contentcolumn-embedding-algoname-topk) call, you can specify two different algorithms. One is using the following:
* [L2DISTANCE Function (Vector)](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/l2distance) or
* [COSINE_SIMILARITY Function (Vector)](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/cosine-similarity-063e1366a7d54735b98b2513ea4a88c9?q=Cosine%20similarity)

You can try out both if you want; you'll need to change the parameter value to do so.

👉 Return the `similaritySearchResults`.

```JavaScript
return similaritySearchResults
```

Your function handler should look like this:

```JavaScript
this.on('executeSimilaritySearch', async () => {
    try {
        const vectorplugin = await cds.connect.to('cap-llm-plugin')
        const embeddings = await vectorplugin.getEmbedding(userQuery)
        const similaritySearchResults = await vectorplugin.similaritySearch(
            tableName,
            embeddingColumn,
            contentColumn,
            embeddings,
            'L2DISTANCE',
            3
        )
        return similaritySearchResults
    } catch (error) {
        console.log('Error while executing similarity search:', error)
        throw error;
    }
})
```

👉 Save the file.

## Test the executeSimilaritySearch() OData function

Use the same technics as before to test the newly implemented service.
Observe your terminal to see what the function call does in detail.

## Summary

You have completed all exercises for this CodeJam. Congratulations! You have built your first CAP application utilizing the CAP-LLM-Plugin and the power of SAP generative AI Hub to expose AI capabilities to your consumers.
There is much more to explore, and your journey has just begun.

If you are done earlier than the rest or you want to challenge yourself, there is an optional exercise containing a task to implement an additional service.

## Further Reading

* [L2DISTANCE Function (Vector)](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/l2distance)
* [COSINE_SIMILARITY Function (Vector)](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/cosine-similarity-063e1366a7d54735b98b2513ea4a88c9?q=Cosine%20similarity)
* [similarity search](https://github.com/SAP-samples/cap-llm-plugin-samples/blob/main/docs/api-documentation.md#async-similaritysearchtablename-embeddingcolumnname-contentcolumn-embedding-algoname-topk)
* [RAG response](https://github.com/SAP-samples/cap-llm-plugin-samples/blob/main/docs/api-documentation.md#async-getragresponseinput-tablename-embeddingcolumnname-contentcolumn-chatinstruction-context-topk3-algonamecosine_similarity-chatparams)
* [CAP-LLM-Plugin samples](https://github.com/SAP-samples/cap-llm-plugin-samples/tree/main)

---

[Optional Challenge](../12-challenge/README.md)

