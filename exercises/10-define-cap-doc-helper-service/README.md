# Exercise 10 - Define the CAP documentation helper service

With the embedding service you learned how to expose AI capabilities from SAP generative AI Hub to the outside world. The service can now be consumed from other applications like UI or other services. You will create another service to expose further capabilities of SAP generative AI Hub via an OData API. This service is responsible for retrieving a RAG response and for the execution of a similarity search.

Because you have created a service before, this exercise will be a bit of a challenge because you will create the service by yourself. The solution is at the end of the exercise.

For this exercise, build a OData service definition `CAPDocumentationService` in CDS containing two OData functions:

* `getRagResponse()`, responsible for retrieving a RAG response from the chat model using the stored vector embeddings.
* `executeSimilaritySearch`, responsible for executing a similarity search against the chat model using the stored vector embeddings.

Both functions return a `String`.

Go ahead and create the CDS service definition in a new file under the `srv` folder. After you have created the service definition test the availability of the service using the respective cds command. If you need help, refer to [Exercise 07 - Define the embedding service](../07-define-embedding-service/README.md)

## Solution

For the solution, open the [solution](./solution.md) file.