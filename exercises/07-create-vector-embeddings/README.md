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
await DBUtils.insertVectorEmbedding(await AIHelper.createVectorEmbedding());
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

👉 To use CDS methods import CDS:

```JavaScript
import cds from '@sap/cds';
```

👉 To have access to the Document Splits table, add the `DocumentSplits` constant:

```JavaScript
const { DocumentSplits } = cds.entities;
```



## Implement the storing of vector embeddings

## Create some vector embeddings