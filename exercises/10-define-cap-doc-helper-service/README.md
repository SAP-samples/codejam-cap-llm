# Exercise 10 - Define the CAP documentation helper service

With the embedding service, you learned how to expose AI capabilities from Generative AI Hub to the outside world. Other applications can consume the service. You will create another service to expose further capabilities of Generative AI Hub via an OData API. This service retrieves a RAG response and executes a similarity search.

Because you have created a service before, this exercise will be challenging because you will create the service by yourself. The solution is at the end of the exercise.

For this exercise, build an OData service definition `CAPDocumentationService` in CDS containing two OData functions:

* `getRagResponse()` retrieves a RAG response from the chat model using the stored vector embeddings.
* `executeSimilaritySearch` executes a similarity search against the chat model using the stored vector embeddings.

Both functions return a `String`.

Create the CDS service definition in a new file under the `srv` folder. After creating the service definition, test the service's availability using the respective cds command; please don't hesitate to let me know. If you need help, refer to [Exercise 07 - Define the embedding service](../07-define-embedding-service/README.md)

## Solution

Open the [solution](./solution.md) file for the solution.

---

[Next exercise](../11-implement-cap-doc-helper-service/README.md)
