# Exercise 04 - Create the SAP AI Core connection configuration

Using the SAP Cloud SDK for AI allows you to seamlessly connect to SAP AI Core, SAP Generative AI Hub, and the Orchestration service. The SDK is available for different programming languages like Python, JavaScript, Java and ABAP. In this Codejam you will use the JavaScript variant to complement a CAP OData service with AI functionality using the SAP Generative AI Hub and Orchestration service.

In this exercise you will learn:

- How to define an environment variable for the SAP Cloud SDK for AI connection.

## Understand how the SAP Cloud SDK for AI establishes connection to SAP AI Core

To establish connection from your CAP application to each of the AI relevant service instances within SAP BTP, a connection configuration needs to happen. With the SAP Cloud SDK for AI, you have two options to do so.

- For testing and local development purposes you can configure a Cloud Foundry service key for SAP AI Core in the `.env` file or as environment variable. The SDK parses the service key from the environment variable to interact with the AI Core service. This setup enables local testing of clients such as orchestration and OpenAI, provided that deployments for orchestration and OpenAI exist in SAP BTP.

- For production, the SDK recommends to create a binding between your application and the SAP AI Core service instance. The binding is more secure as it is not exposing the authentication details in clear text.

For this Codejam you will use the first approach by providing the needed configuration details via the `.env` file. You can find the details for the configuration in the service key for the SAP AI Core instance. The authentication details are only valid during the duration of this Codejam and will be invalidated right after.

## Inspect the .env file

👉 Go ahead and open the [.env](../../project/job-posting-service/.env)

You can see that the `AICORE_SERVICE_KEY` is a JSON object that contains four necessary fields:

- **clientid**: The client ID for the OAuth authentication flow, Client Credentials.
- **clientsecret**: The client secret for the OAuth authentication flow, Client Credentials.
- **url**: The OAuth authentication URL. You need to add `/oauth/token` add the end of the URL to direct to the OAuth token server.
- **serviceurls**:**AI_API_URL**: The SAP AI Core service URLs.

👉 Fill in the information needed using the service key.

## Summary

At this point you have set up your workspace, worked with SAP AI Launchpad by creating a resource group, deployed a model and explored other capabilities. You also learned how to define a connection to SAP AI Core for local development and testing.

In the next exercise you will start implementing the actual CAP service by defining the database schema.

---

[Next exercise](../05-define-db-schema/README.md)
