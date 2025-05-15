# Exercise 08 - Understand data masking, anonymization and pseudonymization

_Estimated Time: **30 min**_

In the past exercises, you have learned a lot about the interaction with an embedding and chat model. You have learned what vector embeddings are, what a vector engine is, how retrieval augmented generation means and how it works. You have learned and worked with content filtering to ensure that no harmful or ill content gets send or retrieved to or from a chat model.

As of now, you're sending data straight to the chat model without regard for data privacy. You want to change this to enhance data privacy for your generative AI use case. Every business is responsible for safeguarding personal data to comply with regulations like the **General Data Protection Regulation (GDPR)** or **California Consumer Privacy Act (CCPA)**. For that reason, it is important that you learn the mechanisms to protect personal data and ensure that only data needed by the LLM is sent to the LLM.

In this exercise you will learn the key differences between anonymization and pseudonymization and their key benefits and downsides. You will learn how to implement these concepts into your orchestration workflow via code and via the SAP AI Launchpad.

In this exercise, you will learn the following:

- What anonymization and pseudonymization are.
- How to use the SAP Cloud SDK for AI orchestration API to manage data privacy.

## Data masking

Data masking describes the process of making defined sets of data unreadable to a human or machine. This process can be achieved via anonymization or pseudonymization. In the following sections, you will learn what they are and how they differ.

### Anonymization

Anonymization describes the process of completely removing or altering any sensitive data like names, addresses, financial data or healthcare data. The result of the anonymization process makes the data irreversable which results in data privacy compliance for most privacy regulations like GDPR and CCPA. Because the data gets completely removed or altered it is not linkable to any individual person and so anonymized data is exempt from most privacy regulations.

A downside of this is the point of unreversability of the data. Sometimes, you want to send contextual information to the LLM, removing all personal and sensitive data to comply with data privacy but after receiving the result of the LLM you want to restore the original information to have all data available for your use case. In that case, you might want to consider using pseudonymization.

### Pseudonymization

Pseudonymization describes the process of replacing identifiable information with artificial identifiers or pseudonyms hence the name pseudonymization. This allows for the creation of a mapping table where these identifiers or pseudonyms can be mapped to the original information allowing you to restore the pseudonymized data. Because you are just replacing information with pseudonyms, it is still considered personal data, which requires you to handle data privacy concerns by privacy regulations. That means security measurements for data theft, data misuse and unauthorized re-identification using the mapping table.

The benefits for a lot of generative AI use cases are that you can pseudonymize the data of the contextual information you're sending to the LLM and restoring the full data set after you have received the LLM's response. You are also still allowing for regulatory compliance with GDPR or CCAP but must ensure that security measures are in place.

In both cases, pseudonymization or anonymization it is always good to have legal involved to ensure complete compliance.

## Implement data masking into your orchestration workflow

To apply data masking to your orchestration workflow you can use the orchestration API of the SAP Cloud SDK for AI configuring the needed measurements within the orchestration client. If you want to manage data masking on a more central place in case you are re-using this configurations for multiple projects or you want to have this maintained outside of code to ease continuous updates of your workflow the SAP AI Launchpad allows you to configure data masking in the orchestration workflow editor.

You will apply anonymization for both approaches in the beginning and change that to pseudonymization to see the difference.

### Use the orchestration API of the SAP Cloud SDK for AI

Using the orchestration API allows you to define data masking options within the initializer of the orchestration client. You will now define a masking provider, a piece of software responsible for performing the data masking, to your client initialization. The used masking provider for today is the SAP Data Privacy Integration, and you are going to use anonymization and pseudonymization as data masking method.

Because the prompt to the chat model includes the email address, first and last name of the recruiter you want to make sure that this information is not being sent to the chat model. You can define what entities you want to mask and you can look at the full list via the link in the further reading section of this exercise.

To perform the masking, you use so-called masking providers. SAP is offering it's own data masking provider with the name of SAP Data Privacy Integration. This is a reuse service on the SAP Business Technology Platform. This service can be utilized using the SAP Cloud SDK for AI as a masking provider.

👉 Open the [ai-helper.js](../../project/job-posting-service/srv/helper/ai-helper.js) file.

In the `orchestrateJobPostingCreation` function handler, within the orchestration client initialization add the masking definition. Because this initializer expects that JSON format definition style you need to find the right spot to add the masking bit.

👉 Right below the closing curly bracket of the `filtering` object add a comma and the masking definition:

```JavaScript
masking: {
  masking_providers: [
    {
      type: 'sap_data_privacy_integration',
      method: 'anonymization',
      entities: [{ type: 'profile-email' }, { type: 'profile-person' }]
    }
  ]
}
```

The implementation should look like this now:

```JavaScript
async function orchestrateJobPostingCreation(user_query) {
  try {
    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: embeddingModelName,
      maxRetries: 0,
      resourceGroup: resourceGroup
    });

    let embedding = await embeddingClient.embedQuery(user_query);
    let splits = await SELECT.from(DocumentChunks)
      .orderBy`cosine_similarity(embedding, to_real_vector(${JSON.stringify(embedding)})) DESC`;

    let text_chunk = splits[0].text_chunk;

    const filter = buildAzureContentFilter({ Hate: 4, Violence: 4 });
    const orchestrationClient = new OrchestrationClient(
      {
        llm: {
          model_name: chatModelName,
          model_params: { max_tokens: 1000, temperature: 0.1 }
        },
        templating: {
          template: [
            {
              role: 'user',
              content:
                ` You are an assistant for HR recruiter and manager.
            You are receiving a user query to create a job posting for new hires.
            Consider the given context when creating the job posting to include company relevant information like pay range and employee benefits.
            The contact details for the recruiter are: Jane Doe, E-Mail: jane.doe@company.com .
            Consider all the input before responding.
            context: ${text_chunk}` + user_query
            }
          ]
        },
        filtering: {
          input: filter,
          output: filter
        },
        masking: {
          masking_providers: [
            {
              type: 'sap_data_privacy_integration',
              method: 'anonymization',
              entities: [{ type: 'profile-email' }, { type: 'profile-person' }]
            }
          ]
        }
      },
      { resourceGroup: resourceGroup }
    );

    const response = await orchestrationClient.chatCompletion();
    console.log(
      `Successfully executed chat completion. ${response.getContent()}`
    );
    return [user_query, response.getContent()];
  } catch (error) {
    console.log(
      `Error while generating Job Posting.
      Error: ${error.response}`
    );
    throw error;
  }
}
```

That is all you need to do. The pseudonymization gets applied each and every time the orchestration client gets initialized and called. I would encourage you to play around with the masking for a bit to familiarize yourself with its capabilities.

Look at the result! You can see that both name and email address are anonymized in the response of the LLM. If you change the `anonymization` method to `pseudonymization` you can see that the name and email won't get send to the LLM but in the response of the LLM both values are filled in.

👉 Go ahead and change the `method` within the `masking providers` array from `anonymization` to `pseudonymization`.

👉 Run another query to see the result in the terminal.

Right now the input and the grounding document get masked. You can change this to exclude the grounding document to be masked by setting an additional property `mask_grounding_input: false` within the masking provider.

More information about the data masking using the orchestration client can be found in the further reading section.

## Summary

This exercise taught you how to apply data masking techniques, like anonymization and pseudonymization, to protect personal data in AI workflows. It emphasized the importance of data privacy and compliance with regulations while ensuring that essential information can still be processed by AI systems. The exercise also highlighted how to implement these concepts using the SAP Cloud SDK for AI and SAP AI launchpad.

### Questions for Discussion

1. What is the difference between anonymization and pseudonymization?

<details><summary>Answer</summary>
Anonymization is the process of completely removing or altering sensitive data, making it irreversible and unlinkable to any individual. This ensures compliance with privacy regulations like GDPR. The downside is that the data becomes irreversible, and you cannot restore the original information.
Pseudonymization, on the other hand, involves replacing identifiable information with artificial identifiers or pseudonyms. This allows you to map the pseudonyms back to the original data, ensuring that the information can still be restored if needed. However, pseudonymized data is still considered personal data and requires additional security measures.

</details>

1. How does the SAP Cloud SDK for AI orchestration API help with data masking?

<details><summary>Answer</summary>
The SAP Cloud SDK for AI orchestration API allows you to integrate data masking into your AI workflows by configuring the orchestration client to use a masking provider. In the exercise, pseudonymization is applied through the `sap_data_privacy_integration` masking provider, which replaces sensitive information like emails and names with pseudonyms before sending the data to the chat model. This ensures that personal data is not exposed to the model, while still allowing essential contextual information to be used.
</details>

## Further Reading

- [Data Masking using Orchestration Client - Sample Code](https://github.com/SAP/ai-sdk-js/blob/f0d290f76b4abb813088f50bedf18a8a4e97187f/sample-code/src/orchestration.ts#L231)
- [Data Masking - SAP Cloud SDK for AI](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md#data-masking)
- [Data Masking - SAP AI Launchpad documentation](https://help.sap.com/docs/ai-launchpad/sap-ai-launchpad/data-masking?locale=en-US&q=data+masking)
- [Data Masking - Generative AI Hub documentation](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/data-masking?locale=en-US&q=data+masking)
