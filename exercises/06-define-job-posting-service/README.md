# Exercise 06 - Define the Job Posting Service

_Estimated Time: **5 - 10 min**_

Imagine you are an AI Engineer and you have been tasked with developing a solution to enable Hiring Managers to create job postings with ease. You are going to utilize Artificial Intelligence and the SAP Cloud Application Programming Model to create an application to create these job postings using a chat model provided through SAP AI Core. These job postings will then be stored in the SAP HANA Cloud database instance on SAP Business Technology Platform.

In this exercise, you will learn:

- How to define a CAP OData service using Core Data Service (CDS).
- How to expose entities from your OData service schema definition.

## Table of Contents

- [Create the job posting service CDS definition](#create-the-job-posting-service-cds-definition)
- [Summary](#summary)
  - [Questions for Discussion](#questions-for-discussion)
- [Further reading](#further-reading)

## Create the job posting service CDS definition

The job posting service is responsible for the creation and deletion of job postings. The creation of a job posting sends a user query to a chat model via SAP AI Core and the SAP Cloud SDK for AI. You will utilize the orchestration package of the SDK to easily create a message for the chat model and send it via an orchestration client. The response from the chat model will then be stored in the SAP HANA Cloud database. You will implement two ways to delete job postings, one which you can explicitly specify what posting should be deleted and one that let you drop the whole table.

👉 Open the [job-posting-service.cds](../../project/job-posting-service/srv/job-posting-service.cds) file.

👉 Below the `JobPostings` projection add the `createJobPosting` function:

```CDS
function createJobPosting(user_query : String) returns String;
```

This function takes a `user_query` parameter, which represents the user's input to the chat model. The function returns a String that is simply a error or success message.

This function will execute a RAG flow to create a Job Posting. With the SAP Cloud SDK for AI, you get different levels of abstraction on how you want to use SAP's AI capabilities.

You can use the orchestration service, which you will do in [exercise 08](../08-implement-job-posting-serivce/README.md), to have a given workflow on how to work with a chat and embedding model. It allows you to define aspects of a complete interaction flow with the different models in a more managed (orchestrated) way.

If you have the need to go one level down and access different features Langchain is providing, you can use the langchain package by the SAP Cloud SDK for AI. This package is basically wrapping the Langchain APIs and adds additional features to it, helping you to more easily connect and interact with SAP's AI solutions. This is really handy as you don't have to implement the interface towards SAP yourself but still have the capabilities of Langchain right at your fingertips.

In this CodeJam, you are using the orchestration client to make the RAG flow as easy as possible.

Now, let's add additional functions to make it possible to delete job postings.

👉 Right below the last function definition, add the `deleteJobPosting` and `deleteJobPostings` functions:

```CDS
function deleteJobPosting(id : String) returns String;
function deleteJobPostings() returns String;
```

## Summary

At this point, you have learned what SAP AI Core and SAP AI Launchpad is, how to define and deploy database artifacts to SAP HANA Cloud, and how to define an OData service using CDS.

In the next exercise, you will implement the business logic, the function handlers, for the job posting service.

### Questions for Discussion

1. What is the purpose of the `createJobPosting` function in the CDS definition?

    <details><summary>Answer</summary>
    The `createJobPosting` function is responsible for creating a job posting by taking a `user_query` (which is the user input to the chat model) as its parameter. It interacts with SAP generative AI Hub to process the query and let the proxy chat model generate a job posting. The creation process involves a Retrieval-Augmented Generation (RAG) flow, which helps in generating the job posting content based on contextual information provided by you.
    </details>

1. What are the benefits of using the orchestration service or Langchain package in this exercise?

    <details><summary>Answer</summary>
    The orchestration service simplifies the interaction with SAP’s AI models by providing a high-level workflow for handling chat and embedding models. It allows you to define the interaction flow in a more managed way. Alternatively, the Langchain package gives more control and flexibility by wrapping Langchain APIs and adding features that help easily connect and interact with SAP AI solutions. It allows you to dive deeper into the AI functionality while still benefiting from the integration features offered by the SAP Cloud SDK for AI.
    </details>

## Further reading

- [CAP Service Integration CodeJam](https://github.com/SAP-samples/cap-service-integration-codejam)
- [Back to Basics with SAP Cloud Application Programming Model(CAP) - YouTube](https://youtube.com/playlist?list=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0&si=V9Rqcbg84UGLQOi-)
- [Providing Services - CAP Documentation](https://cap.cloud.sap/docs/guides/providing-services#providing-services)

---

[Next exercise](../07-implement-job-posting-serivce/README.md)
