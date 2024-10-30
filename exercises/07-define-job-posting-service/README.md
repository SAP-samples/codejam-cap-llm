# Exercise 07 - Define the Job Posting Service

Imagine you are an AI Engineer and you have been tasked with developing a solution to enable Hiring Managers creating job postings with ease. You are going to utilize Artificial Intelligence and the SAP Cloud Application Programming Model to create an application to create these job postings using a chat model provided through SAP AI Core. These job postings will then be stored in the SAP HANA Cloud database instance on SAP Business Technology Platform.

In this exercise you will learn:

- How to define a CAP OData service using Core Data Service (CDS).
- How to expose entities from your OData service schema definition.

## Create the job posting service CDS definition

The job posting service is responsible for the creation and deletion of job postings. The creation of a job posting sends a user query to a chat model via SAP AI Core and the SAP Cloud SDK for AI. You will utilize the orchestration package of the SDK to easily create a message for the chat model and send it to it via an orchestration client. The response from the chat model will then be stored in the SAP HANA Cloud database. You will implement two ways for deleting job postings, one where you can explicitly specify which posting should be deleted and one where you can drop the whole table.

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

Great! You got both entities projected in the OData service. Now, you want to allow the service to do some business logic. As mentioned before you want to implement business logic for the creation and deletion of job postings. To do so, you will now define three OData functions.

👉 Below the `JobPostings` projection add the `createJobPosting` function:

```CDS
function createJobPosting(user_query : String) returns String;
```

This function takes a `user_query` parameter which represents the user's input to the chat model. The function returns a String that is simply a error or success message.

👉 Right below the last function definition add the `deleteJobPosting` and `deleteJobPostings` functions:

```CDS
function deleteJobPosting(id : String) returns String;
function deleteJobPostings() returns String;
```

## Summary

At this point, you have learned what SAP AI Core and SAP AI Launchpad is, how to define and deploy database artifacts to SAP HANA Cloud, and how to define an OData service using CDS.

In the next exercise, you will implement the business logic, the function handlers, for the job posting service.

## Further reading

- [CAP Service Integration CodeJam](https://github.com/SAP-samples/cap-service-integration-codejam)
- [Back to Basics with SAP Cloud Application Programming Model(CAP) - YouTube](https://youtube.com/playlist?list=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0&si=V9Rqcbg84UGLQOi-)
- [Providing Services - CAP Documentation](https://cap.cloud.sap/docs/guides/providing-services#providing-services)

---

[Next exercise](../08-implement-job-posting-serivce/README.md)
