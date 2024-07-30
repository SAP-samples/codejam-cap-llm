# Exercise 11 - Implement the CAP documentation helper service

The implementation for the CAP documentation helper service follows the same principal of the embedding storage service. You are using the `module.exports = function() { }` to expose the function handlers.

You need to implement the function handlers for:

* `getRagResponse()` and
* `executeSimilaritySearch()`

Both methods require information on:
* The table name                            : The table name is the name of the `SAP_CODEJAM_DOCUMENTCHUNK` table.
* The embedding column                      : The embedding column is defined in the database schema. `EMBEDDING`.
* The content column                        : The content column is defined in the database schema. `TEXT_CHUNK`.
* A defined user query                      : The user query is usually transmitted through a UI or via an API parameter. For this CodeJam it is hard coded.
* (Optional) instructions for the chat model: A chat model can receive instructions on how it should answer the user query. You could tell it to respond speaking like a pirate *Arrr* 🏴‍☠️.

In this exercise you will learn:

* How to retrieve a RAG response using the CAP-LLM-Plugin.
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
const userQuery = 'Explain to me what CAP is.' // This can be changed by you.
const instructions = 'Return the result in json format.' // This can be changed by you.
```

👉 Safe the file.

## Implement the getRagResponse() function handler

The `getRagResponse` method, when called, reaches out to the SAP gen AI Hub and asks a given user query to the chat model. The chat model response back with an answer. Through using RAG, the chat model is getting additional contextual information.

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

👉 In the `try` block create a connection to the CAP-LLM-Plugin:

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

The call requires the information defined in the properties. If these values ever change you can just adjust the properties.

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

The function handler is fully implemented, you can start the application locally using the real connections to SAP generative AI Hub and SAP HANA Cloud to test a RAG response call. You should have vector embeddings in the database that will be used by the CAP-LLM-Plugin. In case you tried out the `deleteEmbeddings()` call, create new vector embeddings using the `storeEmbeddings()` call.

👉 Start the CAP application using `cds watch --profile hybrid`.

👉 Open the service UI via `http://localhost:4040/`.

👉 Call the `getRagResponse()` function via the API URL `http://localhost:4004/odata/v4/capdocumentation/getRagResponse()`

![Insert Image]()

👉 Take a look in the terminal to observe what the call does in detail.

![Insert Image]()

👉 Check the response to see if the chat model returns any hallucinations.

> In case there are hallucinations, you have to double check the context information if the requested response can even be answered due to potential missing information. In case the information is missing, add it to the context information or provide a second document. If that is not the issue, you might have to play around with the chunking until you get satisfying results. AI is smart, but it can't answer correctly if the provided contextual information is not proper.

## Implement the executeSimilaritySearch() function handler

The similarity search is used for searching objects where the only available comparator is the similarity between two objects. The CAP-LLM-Plugin is providing an API for this; `similaritySearch()`.

You are going to implement the function handler responsible for executing the similarity search of embeddings matching the user query. 

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

👉 In the `try` block connect to the CAP-LLM-Plugin:

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

If you look into the API documentation for the [similarity search](https://github.com/SAP-samples/cap-llm-plugin-samples/blob/main/docs/api-documentation.md#async-similaritysearchtablename-embeddingcolumnname-contentcolumn-embedding-algoname-topk) call, you can specify two different algorithms. One is using the:
* [L2DISTANCE Function (Vector)](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/l2distance) or
* [COSINE_SIMILARITY Function (Vector)](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/cosine-similarity-063e1366a7d54735b98b2513ea4a88c9?q=Cosine%20similarity)

You can try out both if you want to, you just have to change the parameter value.

👉 Return the `similaritySearchResults`.

```JavaScript
return similaritySearchResults
```

You function handler should look like this:

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

👉 Safe the file.

## Test the executeSimilaritySearch() OData function

Use the same technics like before to test the newly implemented service.
Observe your terminal to see what the function call does in detail.

## Summary

At this point ...

## Further Reading

* [L2DISTANCE Function (Vector)](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/l2distance)
* [COSINE_SIMILARITY Function (Vector)](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/cosine-similarity-063e1366a7d54735b98b2513ea4a88c9?q=Cosine%20similarity)
* [similarity search](https://github.com/SAP-samples/cap-llm-plugin-samples/blob/main/docs/api-documentation.md#async-similaritysearchtablename-embeddingcolumnname-contentcolumn-embedding-algoname-topk)
* [RAG response](https://github.com/SAP-samples/cap-llm-plugin-samples/blob/main/docs/api-documentation.md#async-getragresponseinput-tablename-embeddingcolumnname-contentcolumn-chatinstruction-context-topk3-algonamecosine_similarity-chatparams)

---

## Questions

If you finish earlier than your fellow participants, you might like to ponder these questions. There isn't always a single correct answer and there are no prizes - they're just to give you something else to think about.

---

[Optional Challenge](../12-challenge/README.md)

