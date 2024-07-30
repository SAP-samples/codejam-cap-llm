# Exercise 03 - deploy a Large Language Model with Generative AI Hub on SAP AI Core

## Open SAP AI Launchpad
👉 Go to your BTP subaccount *CAP AI CodeJam*. Navigate to Instances and Subscriptions and select SAP AI Launchpad from the Subscriptions.

![BTP cockpit](assets/2024-07-17_14-43-29copy.png)

## Create a new resource group for your team
👉 Make sure to create a new resource group for your team. DO NOT USE THE DEFAULT RESOURCE GROUP!

![SAP AI Launchpad - Recourse Group 1/2](assets/2024-07-22_10-47-54.png)

👉 Select your resource group. If the refresh on the page does not work, refresh it using the browser refresh.

![SAP AI Launchpad - Recourse Group 2/2](assets/2024-07-22_10-51-07.png)

## Create a configuration to deploy a proxy for a large language model on SAP AI Core

👉 Open the ML Operations tab, go to Scenarios and select the foundation-models scenario. This is the only pre-configered scenario from SAP. For all other custom machine learning models you would need to create your own scenario.

![Scenarios 1/2](assets/2024-07-22_12-52-11.png)

👉 Select the Executables tab and then the serving executable azure-openai to see the available Azure OpenAI models.

![Scenarios 2/2](assets/2024-07-22_13-04-27.png)

👉 Copy the name of the model you want to deploy the proxy for. In this CodeJam we will use gpt-4.
After that we will create a configuration.

![Available models](assets/2024-07-22_13-04-40.png)

👉 Create a new configuration.

![Configurations](assets/2024-07-22_13-15-51.png)

👉 Enter a configuration name of your choice, select the foundation-models scenrario, version and the executable azure-openai. Click next.

![Create configuration 1/4](assets/2024-07-16_16-42-19.png)

👉 Paste the model name gpt-4 into the modelName field and click next.

```sh
gpt-34
```

![Create configuration 2/4](assets/2024-07-16_16-42-54.png)

👉 Click Review on the bottom of the page.

![Create configuration 3/4](assets/2024-07-16_16-43-20.png)

👉 Review the configuration and click create.

![Create configuration 4/4](assets/2024-07-16_16-43-35.png)

## Deploy a proxy for a large language model on SAP AI Core

👉 Click on Create Deployment to create a deployment for that configuration. This will not actually deploy the model but it will deploy a proxy that will return a URL for you to use to query the large language model you specified in the configuration.

![Create deployment 1/5](assets/2024-07-16_16-43-57.png)

👉 For the duration select Standard. You can also select Custom to have the deployment available for a limited time. Click Review.

![Create deployment 2/5](assets/2024-07-16_16-44-17.png)

👉 Click Create.

![Create deployment 3/5](assets/2024-07-16_16-44-32.png)

Once the deployment is running you will receive a URL to query the model. Refresh the page until the URL appears. This can take a couple of minutes.

![Create deployment 4/5](assets/2024-07-16_16-44-49.png)

Using the URL and the client id and the client secret from the SAP AI Core service key, you could now already query the model using any programming language or any API platform.

![Create deployment 5/5](assets/2024-07-16_16-51-40.png)

## Deploy a proxy for an embedding model on SAP AI Core
👉 To implement a retrieval augmented generation (RAG) use case we also need to deploy an embedding model. The embeddings for our text chunks will then be stored in a vector database (e.g. HANA Vector Store). To deploy the embedding model repeat the steps above using the model name: 
```sh
text-embedding-ada-002
```
## Summary

At this point ...

## Further reading

* ...

---

## Questions

If you finish earlier than your fellow participants, you might like to ponder these questions. There isn't always a single correct answer and there are no prizes - they're just to give you something else to think about.

---

[Next exercise](../04-create-resource-group/README.md)