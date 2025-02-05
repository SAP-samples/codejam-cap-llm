# Exercise 05 - Explore the SAP HANA Cloud Vector Engine

SAP HANA Cloud is the leading in-memory database on the market. It is also the go-to database for CAP applications. SAP has added the vector engine to the SAP HANA database. The vector engine provides a data foundation for a new set of natural and intuitive capabilities. For this CodeJam, you will use the vector engine to augment large language models with business context. You will use the vector engine for two things. The engine stores relevant business data as vector embeddings and, second, searches for similar and relevant vector embeddings based on the user's prompts. The corresponding text of these vector embeddings then gets passed along to a defined LLM for accurate business answers using that contextual information.

The nature of a vector engine is to seamlessly work with generative AI applications. By providing the ability to store different types of data, such as text, images, or sound, in the form of vector embeddings, the vector engine can be used to pass data along with Retrieval Augmented Generation (RAG) requests, natural language processing, image recognition, similarity searches, and recommendation systems.

For this CodeJam, the SAP HANA Cloud instance has already been initialized and configured. For detailed instructions on how to set up SAP HANA Cloud on SAP BTP, you can follow the [SAP BTP Setup Guide](../../btp-setup-guide.md).

In this exercise, you will learn:

- What vector embeddings are.
- How to enable the SAP HANA Cloud vector engine
- How to configure your CAP application for SAP HANA deployment
- How to bind your CAP application to a new HDI instance

## What Are Vector Embeddings

> "Vector embeddings are mathematical representations used to encode objects into multi-dimensional vector space. These embeddings capture the relationships and similarities between objects. SAP HANA Cloud Vector Engine will facilitate the storage and analysis of complex and unstructured vector data(embeddings) into a format that can be seamlessly processed, compared, and utilized to build various intelligent data applications and add more context in case of GenAI scenarios."

> Source: Vectorize your Data: SAP HANA Cloud's Vector Engine for Unified Data Excellence

## How do you enable SAP HANA Cloud Vector Engine

The SAP HANA Cloud vector engine comes bundled with the SAP HANA Cloud instance on the SAP Business Technology Platform. Within your subaccount on SAP BTP, you or the global account admin can assign entitlements to enable the SAP HANA Cloud service plan.
Vector embeddings are just one of the supported data types for SAP HANA. They can be used for SQL queries and HANA operations.

## Configure the project for SAP HANA deployment

You need to configure your CAP project for SAP HANA deployment. You can do this by executing the `cds add hana` command. The command configures deployments for SAP HANA to use the `hdbtable` and `hdbview` formats. If you add the argument of `--profile hybrid` to the command, the configuration is added to a `[hybrid]` profile in your `package.json`.

👉 Open the project in SAP Business Application Studio (BAS) or VSCode.

👉 Open a new terminal if not already open.

👉 Execute the `cds add hana --for hybrid` command:

```bash
cds add hana --for hybrid
```

![explore-sap-hana-cloud-vector-engine-add-hana](./assets/01-explore-sap-hana-cloud-vector-engine-add-hana.png)

The profile `hybrid` relates to the hybrid testing scenario, which allows you to run your CAP service on localhost but use a real connection to a running SAP HANA Cloud instance. You will utilize this feature in a later exercise. This is not a requirement. You could execute `cds add hana` to have the default `production` scenario.

👉 Open the `package.json` file in your project.

👉 Notice how there is a new section defined containing SAP HANA-related configuration:

```JSON
"cds": {
    "requires": {
      "[hybrid]": {
            "db":"hana"
      }
    }
  }
```

## Create your HDI container for HANA deployment

For this CodeJam each of you will create their own HDI container.

👉 Open a new terminal if not already open.

👉 Log into SAP BTP using the Cloud Foundry CLI:

```bash
cf login -a https://api.cf.us10.hana.ondemand.com
```

Or if you want to use the SSO login option:

```bash
cf login -a https://api.cf.us10.hana.ondemand.com --sso
```

Use the Cloud Foundry CLI to create your HDI container **(replace the placeholder with a meaningful name)**:

```bash
cf create-service hana hdi-shared <your hdi-container name>
```

Creating the HDI container takes some time. You can monitor the process using the following command:

```bash
cf service <your hdi-container name>
```

![explore-sap-hana-cloud-vector-engine-create-hdi-instance](./assets/04-explore-sap-hana-cloud-vector-engine-create-hdi-instance.png)

Once the service creation is complete, you can proceed to the next step.

![explore-sap-hana-cloud-vector-engine-create-hdi-instance](./assets/03-explore-sap-hana-cloud-vector-engine-create-hdi-instance-done.png)

## Bind local service to SAP HANA Schemas & HDI Containers instance for hybrid testing

At this point, your CAP application knows that you want to use an SAP HANA database for persistence, but it doesn't yet know which database instance to use and has no connection. You need to bind your application to the SAP HANA Cloud instance configured on SAP BTP. When you bind your application, an HDI container instance gets spun up for your application's data, and a service key is issued to authenticate against that instance.

You can use the CDS CLI to bind your application to the SAP HANA Schemas & HDI Containers instance.

👉 Open the project in SAP Business Application Studio (BAS) or VSCode.

👉 Open a new terminal if not already open.

👉 Create a binding for your CAP application **(replace the placeholder with a meaningful name)**:

```bash
cds bind -2 <your-hdi-container-name>:<your-service-key-name>
```

![explore-sap-hana-cloud-vector-engine-binding-config](./assets/02-explore-sap-hana-cloud-vector-engine-binding-config.png)

## Summary

At this point, you have learned what the SAP HANA Cloud vector engine is, how vector embeddings work, how to get your project ready for SAP HANA deployment, and how to bind your application to an HDI container instance. In the following exercises, you will evolve your project into a fully functioning CAP AI service application utilizing SAP HANA Cloud vector engine, Generative AI Hub, embedding, and chat LLMs.

### Questions for Discussion

1. What are vector embeddings and how do they work with the SAP HANA Cloud Vector Engine?
<details><summary>Answer</summary>
   Vector embeddings are mathematical representations that encode objects into a multi-dimensional vector space. They capture relationships and similarities between different objects. The SAP HANA Cloud Vector Engine facilitates the storage, analysis, and comparison of complex and unstructured vector data (embeddings).
   </details>

2. How can you enable the SAP HANA Cloud Vector Engine in your SAP BTP environment?
<details><summary>Answer</summary>
The SAP HANA Cloud Vector Engine comes bundled with SAP HANA Cloud on the SAP Business Technology Platform.
</details>

3. How do you configure your CAP application for SAP HANA deployment?
<details><summary>Answer</summary>
To configure your CAP application for SAP HANA deployment, you can run the command:

```bash
cds add hana --for hybrid
```

4. What is the purpose of creating an HDI container for HANA deployment, and how do you do it?
<details><summary>Answer</summary>
An HDI (HANA Deployment Infrastructure) container is a secure storage container for database artifacts like tables and views in SAP HANA Cloud. Each CAP application can use its own HDI container to store and read data from the HANA databaase. To create an HDI container, you can use the Cloud Foundry CLI.

```bash
cf create-service hana hdi-shared <your-hdi-container-name>
```

After the container is created, you can bind it to your CAP application to allow it to interact with the SAP HANA database.

</details>
## Further reading

- [RAG with SAP HANA Cloud Vector Engine, GenAI Hub & CAP](https://community.sap.com/t5/technology-blogs-by-sap/rag-with-sap-hana-cloud-vector-engine-genai-hub-amp-cap/ba-p/13700459)
- [SAP HANA Cloud Vector Engine: Quick FAQ Reference](https://community.sap.com/t5/technology-blogs-by-sap/sap-hana-cloud-vector-engine-quick-faq-reference/ba-p/13675212)
- [SAP HANA Vector Engine and LangChain](https://community.sap.com/t5/technology-blogs-by-sap/hana-vector-engine-and-langchain/ba-p/13636959)
- [Retrieval Augmented Generation and Generative AI on SAP BTP
  ](https://discovery-center.cloud.sap/refArchDetail/ref-arch-open-ai)
- [Harnessing Generative AI Capabilities with SAP HANA Cloud Vector Engine
  ](https://discovery-center.cloud.sap/missiondetail/4405/4691/?tab=overview)
- [SAP HANA Cloud, SAP HANA Database Vector Engine Guide](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/sap-hana-cloud-sap-hana-database-vector-engine-guide?locale=en-US)
- [Start your free trial of SAP HANA Cloud](https://www.sap.com/products/technology-platform/hana/trial.html)
- [Using SAP HANA Cloud for Production
  ](https://cap.cloud.sap/docs/guides/databases-hana)

---

[Next exercise](../06-define-db-schema/README.md)
