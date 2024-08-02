# Exercise 02 - Use SAP AI Launchpad to deploy a Large Language Model with Generative AI Hub on SAP AI Core

SAP AI Launchpad is a multitenant SaaS application on SAP BTP. You can use SAP AI Launchpad to manage AI use cases across different AI runtimes. SAP AI Launchpad also provides generative AI
capabilities via the Generative AI Hub and is available in the Cloud Foundry environment. To access Generative AI Hub you need the **extended plan** of the AI runtime SAP AI Core. You can also connect HANA as an AI runtime or the SAP AI Services, to work with HANA Predictive Analysis Library (PAL) or the SAP AI Service Data Attribute Recommendation.

## Open SAP AI Launchpad
👉 Go to your BTP subaccount **CAP AI CodeJam**. 

👉 Navigate to Instances and Subscriptions and select SAP AI Launchpad from Subscriptions to open SAP AI Launchpad.

![BTP cockpit](assets/2024-07-17_14-43-29copy.png)

## Create a new resource group for your team
SAP AI Core tenants use resource groups to isolate AI resources and workloads. Scenarios (e.g. **foundation-models**)
and executables (that is a template to train a model or create a deployment) are shared across all resource groups.

👉 Make sure to create a NEW resource group for your team. DO NOT USE THE DEFAULT RESOURCE GROUP! 

👉 Open the **SAP AI Core Administration** tab and select **Resource Groups**. 

👉 Create a new resource group with your team's name.

![SAP AI Launchpad - Recourse Group 1/2](assets/2024-07-31_12-03-53.png)

👉 Go back to Workspaces and select your resource group and make sure it is selected. It should show up at the top next to SAP AI Launchpad.

☝️ You will need the name of your resource group in [Exercise 09-create-connection-configuration](../09-create-connection-configuration/README.md).

![SAP AI Launchpad - Recourse Group 2/2](assets/2024-07-31_12-05-01.png)

## Create a configuration to deploy a proxy for a large language model on SAP AI Core
With Generative AI Hub on SAP AI Core you have access to all major large language models (LLMs). There are open-source models that SAP has deployed such as the **Falcon** model. And there are models that SAP is a proxy for, such as the GPT models, Google models, models provided by Amazon Bedrock and more. To use one of the provided LLMs for a custom use case you need to create a deployment configuration of the model. Using the configuration you can then deploy the model. You will then get a deployment url that is created for you to query the model of your choice.

👉 Open the ML Operations tab, go to Scenarios and select the foundation-models scenario. This is the only pre-configured scenario from SAP. For all other custom machine learning models you would want to train or deploy you need to create your own scenario.

![Scenarios 1/2](assets/2024-07-22_12-52-11.png)

👉 Select the Executables tab and then the serving executable azure-openai to see the available Azure OpenAI models.

![Scenarios 2/2](assets/2024-07-22_13-04-27.png)

👉 Copy the name of the model you want to deploy the proxy for. In this CodeJam we will use gpt-35-turbo.
After that we will create a configuration.

![Available models](assets/2024-07-22_13-04-40.png)

👉 Create a new configuration.

![Configurations](assets/2024-07-22_13-15-51.png)

👉 Enter a configuration name of your choice, select the foundation-models scenario, version and the executable **azure-openai**. Click next.

![Create configuration 1/4](assets/2024-07-16_16-42-19.png)

👉 Paste the model name gpt-35-turbo into the modelName field and click next.

```
gpt-35-turbo
```

![Create configuration 2/4](assets/2024-07-16_16-42-54.png)

👉 Click Review on the bottom of the page.

![Create configuration 3/4](assets/2024-07-16_16-43-20.png)

👉 Review the configuration and click create.

![Create configuration 4/4](assets/2024-07-16_16-43-35.png)

## Deploy a proxy for a large language model on SAP AI Core

👉 Click on Create Deployment to create a deployment for that configuration. This will not actually deploy the model but it will deploy a proxy that will return a URL for you to use to query the large language model you specified in the configuration.

![Create deployment 1/5](assets/2024-07-16_16-43-57.png)

👉 For the duration select **Standard**. You can also select **Custom** to have the deployment available for a limited time. Click Review.

![Create deployment 2/5](assets/2024-07-16_16-44-17.png)

👉 Click Create.

![Create deployment 3/5](assets/2024-07-16_16-44-32.png)

Once the deployment is running you will receive a URL to query the model. Refresh the page until the URL appears. This can take a couple of minutes.

![Create deployment 4/5](assets/2024-07-16_16-44-49.png)

Using the URL, the client id and the client secret from the SAP AI Core service key, you could now already query the model using any programming language or any API platform.

☝️ You will need the deployment ID of both models in [Exercise 09-create-connection-configuration](../09-create-connection-configuration/README.md).

![Create deployment 5/5](assets/2024-07-16_16-51-40.png)

## Deploy a proxy for an embedding model on SAP AI Core
👉 To implement a retrieval augmented generation (RAG) use case we also need to deploy an embedding model. The embeddings for our text chunks will then be stored in a vector database (e.g. HANA Vector Store). To deploy the embedding model repeat the steps above using the model name **text-embedding-ada-002** instead of **gpt-4**: 
```
text-embedding-ada-002
```
## Summary

At this point, you will have learned how to create your own resource group, which models are available via Generative AI Hub and deploy LLMs in SAP AI Launchpad.

## Further reading

* [SAP AI Launchpad - Help Portal (Documentation)](https://help.sap.com/docs/ai-launchpad/sap-ai-launchpad/what-is-sap-ai-launchpad)
* [SAP AI Core Terminology](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/terminology)
* [Available Models in the Generative AI Hub](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/models-and-scenarios-in-generative-ai-hub)

---

[Next exercise](../03-explore-genai-hub/README.md)
