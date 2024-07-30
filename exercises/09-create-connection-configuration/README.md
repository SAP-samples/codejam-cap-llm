# Exercise 09 - Create the CAP-LLM-Plugin connection configuration

The CAP-LLM-Plugin uses a set of configurations to have all required information about:

* What kind of embedding model to use.
* What kind of chat model to use.
* What resource group the deployment model is in.
* What resource group the chat model is in.
* What destination to use for connecting to SAP generative AI Hub.

Because you could have multiple destinations configured in your CAP application you have to explicitly tell the CAP-LLM-Plugin what destination to use. The complete configuration for the destination as well as the CAP-LLM-Plugin can be done in the `.cdsrc-private.json` file.

In this exercise you will learn:

* How to create a destination configuration.
* How to create the CAP-LLM-Plugin configuration.
* Where to find the required information in SAP generative AI Hub.

## Create the destination configuration

👉 Open BAS or your local VSCode instance.

👉 Open the `.cdsrc-private.json` file.

👉 Insert the destination configuration to the JSON. Make sure it is defined in the `requires` object right after the closing bracket of the `hybrid` object array.

```JSON
{
  "requires": {
    "[hybrid]": {
      "db": {
        ...
      },
      "destinations": {
        ...
      }
    },
    "AICoreAzureOpenAIDestination": {
      "kind": "rest",
      "credentials": {
        "destination": "codejam-ai-dest",
        "requestTimeout": "300000"
      }
    },
  }
}
```

If you observe closely, the destination configuration points to the destination from the destination service on SAP BTP. The CAP-LLM-Plugin can connect to the destination service using the binding and lookup the destination with the given name.

## Create the CAP-LLM-Plugin configuration

👉 Make sure there is a comma present right below the `AICoreAzureOpenAIDestination` object.

👉 Add the configuration for the CAP-LLM-Plugin right below the comma as a next object:

```JSON
"GENERATIVE_AI_HUB": {
    "CHAT_MODEL_DESTINATION_NAME": "AICoreAzureOpenAIDestination",
    "CHAT_MODEL_DEPLOYMENT_URL": "/v2/inference/deployments/<Your-Deployment-ID>",
    "CHAT_MODEL_RESOURCE_GROUP": "<Your-Resource-Group>",
    "CHAT_MODEL_API_VERSION": "<API-Version>",
    "EMBEDDING_MODEL_DESTINATION_NAME": "AICoreAzureOpenAIDestination",
    "EMBEDDING_MODEL_DEPLOYMENT_URL": "/v2/inference/deployments/<Your-Deployment-ID>",
    "EMBEDDING_MODEL_RESOURCE_GROUP": "<Your-Resource-Group>",
    "EMBEDDING_MODEL_API_VERSION": "<API-Version>"
}
```

The complete `.cdsrc-private.json` should look like this now:

```JSON
{
  "requires": {
    "[hybrid]": {
      "db": {
        "binding": {
          // ...
        },
        "kind": "hana",
        "vcap": {
          "name": "db"
        }
      },
      "destinations": {
        "binding": {
          // ...
        },
        "kind": "destinations",
        "vcap": {
          "name": "destinations"
        }
      }
    },
    "GENERATIVE_AI_HUB": {
        "CHAT_MODEL_DESTINATION_NAME": "AICoreAzureOpenAIDestination",
        "CHAT_MODEL_DEPLOYMENT_URL": "/v2/inference/deployments/<Your-Deployment-ID>",
        "CHAT_MODEL_RESOURCE_GROUP": "<Your-Resource-Group>",
        "CHAT_MODEL_API_VERSION": "<API-Version>",
        "EMBEDDING_MODEL_DESTINATION_NAME": "AICoreAzureOpenAIDestination",
        "EMBEDDING_MODEL_DEPLOYMENT_URL": "/v2/inference/deployments/<Your-Deployment-ID>",
        "EMBEDDING_MODEL_RESOURCE_GROUP": "<Your-Resource-Group>",
        "EMBEDDING_MODEL_API_VERSION": "<API-Version>"
    },
    "AICoreAzureOpenAIDestination": {
      "kind": "rest",
      "credentials": {
        "destination": "codejam-ai-dest",
        "requestTimeout": "300000"
      }
    }
  }
}
```

## Lookup the required configuration information

You can use the SAP AI Launchpad to inspect the required values. In [Exercise 04](../04-create-resource-group/README.md) you have learned how to create a resource group and deploy models to it. The information of these objects are required for the CAP-LLM-Plugin configuration.

What do you need:

* `Resource Group Name`
* `Chat Model Id`
* `Embedding Model Id`
* `API Version`

### Lookup and configure the resource group name

👉 Open your web browser.

👉 Go to the [SAP BTP - Instances and Subscriptions](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/subaccount/6088766d-dcc4-4e56-972f-652baad796be/service-instances) view.

👉 Click on the little icon right next to the `SAP AI Launchpad` application instance.

![create-connection-configuration-btp](./assets/01-create-connection-configuration-btp.png)

That will launch the SAP AI Launchpad in a separate tab within your browser.

👉 Open the SAP AI Launchpad.

![create-connection-configuration-launchpad](./assets/02-create-connection-configuration-launchpad.png)

👉 Through the sidebar navigate to `SAP AI Core Administration`.

👉 Click on `Resource Groups` and copy the name.

![create-connection-configuration-resource-group](./assets/03-create-connection-configuration-resource-group.png)

👉 In BAS or your local VSCode instance open the `.cdsrc-private.json` file and add the resource group name to the:

* `CHAT_MODEL_RESOURCE_GROUP` and 
* `EMBEDDING_MODEL_RESOURCE_GROUP`

👉 Save the file.

### Lookup and configure the deployment Id

👉 Open SAP AI Launchpad.

👉 Through the sidebar navigate to `ML Operations`.

👉 Click on `Deployments`.

You can see two different deployments. One for the embedding model and one for the chat model. Both of these have an identifier.

👉 Copy the identifiers of both models and replace the placeholder within the URLs of

* `CHAT_MODEL_DEPLOYMENT_URL` and
* `EMBEDDING_MODEL_DEPLOYMENT_UR`.

👉 Safe the file.

## Test the storeEmbeddings() OData function

Everything is configured to try out the `storeEmbeddings()` OData function.

👉 Open a new terminal or use an existing one.

👉 Start your CAP application by running `cds watch --profile hybrid`.

👉 Open your web browser and enter the following URL `http://localhost:4004/odata/v4/embedding-storage/storeEmbeddings()`.

👉 Inspect your terminal output to understand the single steps happening with this call. You can clearly see all the steps happening from reading the context information, to chunking and table inserts.

![create-connection-configuration-run-api](./assets/04-create-connection-configuration-run-api.png)

## Check the entries in the database.

👉 Make sure the service is still running.

👉 Open your web browser.

👉 Open `http://localhost:4040/`.

👉 Click on `DocumentChunk`.

![create-connection-configuration-documentchunk](./assets/05-create-connection-configuration-documentchunk.png)

As you can see the entities are stored in the database. With that you can use the CAP-LLM-Plugin to execute RAG responses using the vector embeddings bringing contextual information to the chat model.

## Summary

At this point you have implemented your first AI focused CAP application OData service, directly exposing SAP generative AI capabilities to the outside world! Let's keep the momentum going and implement a service allowing you to retrieve a RAG response based on the context information provided within the SAP HANA Cloud vector engine.

---

## Questions

If you finish earlier than your fellow participants, you might like to ponder these questions. There isn't always a single correct answer and there are no prizes - they're just to give you something else to think about.

---

[Next exercise](../10-define-cap-doc-helper-service/README.md)