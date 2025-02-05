# Exercise 02 - Use SAP AI Launchpad to Deploy a Large Language Model with Generative AI Hub on SAP AI Core

SAP AI Launchpad is a multi-tenant SaaS application on SAP BTP. You can use SAP AI Launchpad to manage AI use cases across different AI runtimes. SAP AI Launchpad also provides generative AI capabilities via the Generative AI Hub and is available in the Cloud Foundry environment. You can also connect HANA as an AI runtime or use SAP AI Services to work with the HANA Predictive Analysis Library (PAL) or the SAP AI Service Data Attribute Recommendation.

## Open SAP AI Launchpad

👉 Go to your BTP subaccount **CAP AI CodeJam**.

👉 Navigate to **Instances and Subscriptions** and select **SAP AI Launchpad** from Subscriptions to open SAP AI Launchpad.

![BTP cockpit](assets/BTP_cockpit.png)

## Create a New Resource Group

SAP AI Core tenants use resource groups to isolate AI resources and workloads. Scenarios (e.g., `foundation-models`) and executables (a template for training a model or creating a deployment) are shared across all resource groups.

> Make sure to create a **NEW** resource group. **DO NOT USE THE DEFAULT RESOURCE GROUP!**

👉 Open the **SAP AI Core Administration** tab and select **Resource Groups**.

👉 **Create** a new resource group with your initials.

![SAP AI Launchpad - Resource Group 1/2](assets/resource_group.png)

👉 Go back to **Workspaces**.

👉 Select your connection and your resource group.

👉 Ensure it is selected. It should appear at the top next to SAP AI Launchpad.

> You will need the name of your resource group in [Exercise 09-create-connection-configuration](../09-create-connection-configuration/README.md).

![SAP AI Launchpad - Resource Group 2/2](assets/resource_group_2.png)

## Create a Configuration to Deploy a Proxy for a Large Language Model on SAP AI Core

With Generative AI Hub on SAP AI Core, you have access to all major large language models (LLMs). There are open-source models that SAP has deployed, such as the Falcon model, and models that SAP is a proxy for, like the GPT models, Google models, Amazon Bedrock models, and more. To use one of the provided LLMs for a custom use case, you need to create a deployment configuration for the model. Using this configuration, you can then deploy the model. You will receive a deployment URL that you can use to query the model of your choice.

👉 Open the **ML Operations** tab.

👉 Go to **Scenarios**.

👉 Select the **foundation-models** scenario.  
Scenarios related to generative AI are the only pre-configured scenarios provided by SAP. For all other custom machine learning models you wish to train or deploy, you will need to create your own scenario.

![Scenarios 1/2](assets/scenarios.png)

👉 Select the **Executables** tab.

👉 Select the **serving executable azure-openai** to view the available Azure OpenAI models.

![Scenarios 2/2](assets/scenarios_2.png)

👉 Copy the name of the model you want to deploy a proxy for.

For this CodeJam, you will use `gpt-4o-mini`. After that, you will create a configuration.

👉 Click on **Configurations**.

👉 **Create** a new configuration.

![Configurations](assets/configurations.png)

👉 Enter a configuration name, e.g., `conf-gpt-4o-mini`, select the **foundation-models** scenario, version, and the executable **azure-openai**.

👉 Click **Next**.

![Create configuration 1/4](assets/configurations_2.png)

👉 Paste the model name `gpt-4o-mini` into the **modelName** field and click **Next**.

![Create configuration 2/4](assets/configurations_3.png)

👉 Click **Review** at the bottom of the page.

![Create configuration 3/4](assets/configurations_4.png)

👉 Review the configuration and click **Create**.

![Create configuration 4/4](assets/configurations_5.png)

## Deploy a Proxy for a Large Language Model on SAP AI Core

👉 Click on **Create Deployment** to create a deployment for that configuration.  
This will not actually deploy the model but will deploy a proxy that will return a URL for you to use to query the LLM you specified in the configuration.

![Create deployment 1/5](assets/deployments.png)

👉 For the duration, select **Standard**.  
You can also select **Custom** to have the deployment available for a limited time.

👉 Click **Review**.

![Create deployment 2/5](assets/deployments_2.png)

👉 Click **Create**.

![Create deployment 3/5](assets/deployments_3.png)

The deployment status will change from `UNKNOWN` to `PENDING`, then to `RUNNING`. Once the deployment is running, you will receive a URL to query the model. Wait a couple of minutes, then **refresh** the page for the URL to appear.

![Create deployment 4/5](assets/deployments_4.png)

Using the `URL`, `client id`, and `client secret` from the SAP AI Core service key, you can now query the model using any programming language or API platform.

## Deploy a Proxy for an Embedding Model on SAP AI Core

👉 To implement a retrieval-augmented generation (RAG) use case, we also need to deploy an embedding model. The embeddings for our text chunks will then be stored in a vector database (e.g., [SAP HANA Cloud Vector Engine](https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-vector-engine-guide/sap-hana-cloud-sap-hana-database-vector-engine-guide)).

To deploy the embedding model, repeat the steps above using the model name `text-embedding-ada-002` instead of `gpt-4o-mini`:

## Summary

At this point, you will have learned how to create your own resource group, which models are available via the Generative AI Hub, and how to deploy LLMs in SAP AI Launchpad.

### Questions for Discussion

1. What is SAP AI Launchpad, and what can it be used for?

  <details><summary>Answer</summary>
   SAP AI Launchpad is a multi-tenant SaaS application on SAP Business Technology Platform. It helps you manage AI use cases across different AI runtimes and provides generative AI capabilities via the SAP Generative AI Hub.
  </details>

2. What is the purpose of creating a new resource group in SAP AI Launchpad, and how should it be done?

  <details><summary>Answer</summary>
  Creating a new resource group in SAP AI Launchpad helps isolate AI resources and workloads for better management.
  </details>

3. How do you deploy a proxy for a large language model (LLM) on SAP AI Core using SAP AI Launchpad?

<details><summary>Answer</summary>
To deploy a proxy for an LLM, you need to:

  1. Open the ML Operations tab in SAP AI Launchpad.
  2. Select the foundation-models scenario, and then choose the model executable (e.g., azure-openai).
  3. Create a new configuration, specifying the model name (e.g., gpt-4o-mini).
  4. After reviewing the configuration, click Create.
  5. Then, click Create Deployment to deploy a proxy. Once the deployment status changes to RUNNING, you will receive a URL to query the model.

</details>

## Further Reading

- [SAP AI Launchpad - Help Portal (Documentation)](https://help.sap.com/docs/ai-launchpad/sap-ai-launchpad/what-is-sap-ai-launchpad)
- [SAP AI Core Terminology](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/terminology)
- [Available Models in the Generative AI Hub](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/models-and-scenarios-in-generative-ai-hub)

---

[Next exercise](../03-explore-genai-hub/README.md)
