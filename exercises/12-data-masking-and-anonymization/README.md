# Exercise 12 - Understand data masking, what is anonymization and pseudonymization

In the past exercises you have learned a lot about the interaction with an embedding and chat model. You have learned what vector embeddings are, what a vector engine is, how retrieval augmented generation means and how it works. You have learned and worked with content filtering to ensure that no harmful or ill content gets send or retrieved to or from a chat model.

As of know you're sending data straight to the chat model without any regards for data privacy. You want to change this to enhance data privacy for you generative AI use case. Every business is responsible for safeguarding personal data to comply with regulations like the **General Data Protection Regulation (GDPR)** or **California Consumer Privacy Act (CCPA)**. For that reason it is important that you learn the mechanisms to protect personal data and ensure that only data needed by the LLM gets send to the LLM. 

In this exercise you will learn the key differences between anonymization and pseudonymization and their key benefits and downsides. You will learn how to implement these concepts into your orchestration workflow via code and via the SAP AI Launchpad.

In this exercise, you will learn the following:

- What anonymization and pseudonymization is.
- How to use the SAP Cloud SDK for AI orchestration API to manage data privacy.
- How to use the SAP AI Launchpad to manage an orchestration workflow in regards to data privacy.

## Data masking

Data masking describes the process of making defined sets of data unreadable to a human or machine. This process can be achieved via anonymization or pseudoanymization. In the following capitlas, you will learn what they are and how they differ.

### Anonymization

Anonymization describes the process of completely removing or altering any sensitive data like names, addresses, financial data or healthcare data. The result of the anonymization process makes the data irreversable which results in data privacy compliance for most privacy regulations like GDPR and CCPA. Because the data gets completely removed or altered it is not linkable to any individual person and so anonymized data is exempt from most privacy regulations.

A downside of this is the point of unreversability of the data. Sometimes you want to send contextual information to the LLM, removing all personal and sensitive data to comply with data privacy but after receiving the result of the LLM you want to restore the original information to have all data available for your use case. In that case you might want to consider using pseudonymization.

### Pseudonymization

Pseudonymization describes the process of replacing identifiable information with artificial identifiers or pseudonyms hence the name pseudonymization. This allows for creation of a mapping table where these identifiers or pseudonyms can be mapped to the original information allowing you to restore the pseudonymized data. Because you are just replacing information with pseudonyms it is still considered personal data which requires you to handle data privacy concerns by privacy regulations. That means security meassurements for data theft, data misuse and unauthorized re-identification using the mapping table.

The benefits for a lot of generative AI use cases is that you can pseudonymize the data of the contextual information you're sending to the LLM and restoring the full data set after you have received the LLM's response. You are also still allowing for regulatory compliance with GDPR or CCAP but must ensure that security meassures are in place.

In both cases, pseudonymization or anonymization it is always good to have legal involved to ensure complete compliance.

## Implement data masking into your orchestration workflow

To apply data masking to your orchestration workflow you can use the orchestration API of the SAP Cloud SDK for AI configuring the needed meassurements within the orchestration client. If you want to manage data masking on a more central place in case you are re-using this configurations for multiple projects or you want to have this maintained outside of code to ease continuase updates of your workflow the SAP AI Launchpad allows you to configure data masking in the orchestration workflow editor.

You will apply pseudonymization for both approaches.

### Use the orchestration API of the SAP Cloud SDK for AI



### Use the SAP AI Launchpad visual orchestration workflow editor

## Summary

## Further Reading