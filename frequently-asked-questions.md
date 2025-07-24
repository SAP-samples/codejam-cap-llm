# Frequently Asked Questions (FAQ)

Welcome! Here you'll find answers to some of the most commonly asked questions.

---

## Table of Contents

- [Retrieval Augmented Generation](#retrieval-augmented-generation)
- [Learning](#learning)
- [Contact](#contact)

---

## Retrieval Augmented Generation

**Q: Can I provide just the raw vectors to the LLM in order to save storage on the HANA database excluding metadata and chunk information?**  
A: _You can't give an LLM raw vectors (like arrays of floats) and expect the LLM to "understand" or decode them back into natural language. Embedding vectors are lossy and directional — they’re designed for similarity comparison, not reversible interpretation._

**Q: Where do I put the contextual information in a classic RAG flow?**  
A: _Put the retrieved text chunks into the **user message**, not the system message._

- The **system message** is best used to set overall behavior, tone, or identity of the assistant (e.g., “You are a helpful technical assistant.”).
- The **user message** is where the contextual information should go — this allows the LLM to consider it as part of the question, giving it full attention when formulating the response.

---

## Learning

**Q: Where can I learn more about AI?**
A: _You can take a look at the **Further Learning** sections of each exercise and in the main Readme of this repository._

Below is the direct link to the **Further Learning** section of the main Readme:

[Learning section in the main README](../README.md#further-learning)

Below are direct links to the **Further Reading** sections in each exercise:

- [Exercise 00 - Set up your workspace](exercises/00-set-up-workspace/README.md#further-reading)
- [Exercise 01 - Explore Generative AI Hub in SAP AI Launchpad](exercises/01-explore-genai-hub/README.md#further-reading)
- [Exercise 02 - Create the SAP AI Core connection configuration](exercises/02-create-connection-configuration/README.md#further-reading)
- [Exercise 03 - Explore the SAP HANA Cloud Vector Engine](exercises/03-explore-sap-hana-cloud-vector-engine/README.md#further-reading)
- [Exercise 04 - Create the database schema for the CAP application](exercises/04-define-db-schema/README.md#further-reading)
- [Exercise 05 - Create vector embeddings using an embedding model](exercises/05-create-vector-embeddings/README.md#further-reading)
- [Exercise 06 - Define the Job Posting Service](exercises/06-define-job-posting-service/README.md#further-reading)
- [Exercise 07 - Implement the Job Posting Service](exercises/07-implement-job-posting-service/README.md#further-reading)
- [Exercise 08 - Understand data masking, anonymization and pseudonymization](exercises/08-data-masking-and-anonymization/README.md#further-reading)

## Contact

**Q: How can I get in touch?**  
A: _Send me a message on [LinkedIn](https://www.linkedin.com/in/kevinmuessig/) or via [mail](kevin.riedelsheimer@sap.com)_

---