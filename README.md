# Build AI services using the SAP Cloud Application Programming Model, SAP AI Core and SAP generative AI Hub

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/codejam-cap-llm)](https://api.reuse.software/info/github.com/SAP-samples/codejam-cap-llm)

## Table of Contents

- [Description](#description)
- [Overview](#overview)
- [Session prerequisites](#session-prerequisites)
- [Exercises](#exercises)
- [Further Learning on AI](#further-learning-on-ai)
  - [YouTube Videos](#youtube-videos)
  - [Learning](#learning)
  - [Customer & Partner projects](#customer--partner-projects)
- [Feedback](#feedback)
- [Other CodeJams](#other-codejams)
  - [CodeJam repositories](#codejam-repositories)
  - [CodeJam Community](#codejam-community)
- [Acknowledgements](#acknowledgements)
- [How to obtain support](#how-to-obtain-support)
- [License](#license)

## Description

This repository contains the material for the "Expose SAP AI Core capabilities with the SAP Cloud Application Programming Model" CodeJam.

## Overview

This CodeJam introduces attendees to aspects of exposing generative artificial intelligence (genAI) capabilities to execute tasks using a given business context.

During this event, you'll become acquainted with the theory behind genAI, SAP AI Core, SAP AI Launchpad, and learn how to use the SAP Cloud Application Programming Model to expose AI capabilities through your own OData service.

While working through the exercises, you'll become comfortable creating CDS-based service definitions and integrating them into the SAP Business Technology Platform (BTP) and SAP AI Core Foundation Models.

![end2end-solution-diagram](/assets/End2End_Vector_Embedding_Solution_Diagram.png)

## Session prerequisites

Certain prerequisites must be fulfilled before the day of the CodeJam in order to get the most from this CodeJam and be able to work through the exercises.

The prerequisites are detailed in a separate [prerequisites](prerequisites.md) file. Please ensure you have everything ready before attending the CodeJam.

## Exercises

These are the exercises, each in their directory, sometimes with supporting files and scripts. We will work through the exercises in the order shown here. From a session flow perspective, we are taking the "coordinated" approach:

- [Exercise 00 - Set up your workspace](./exercises/00-set-up-workspace/README.md)
- [Exercise 01 - Explore Generative AI Hub in SAP AI Launchpad](./exercises/01-explore-genai-hub/README.md)
- [Exercise 02 - Create the SAP AI Core connection configuration](./exercises/02-create-connection-configuration/README.md)
- [Exercise 03 - Explore the SAP HANA Cloud Vector Engine](./exercises/03-explore-sap-hana-cloud-vector-engine/README.md)
- [Exercise 04 - Create the database schema for the CAP application](./exercises/04-define-db-schema/README.md)
- [Exercise 05 - Create vector embeddings using an embedding model](./exercises/05-create-vector-embeddings/README.md)
- [Exercise 06 - Define the Job Posting Service](./exercises/06-define-job-posting-service/README.md)
- [Exercise 07 - Implement the Job Posting Service](./exercises/07-implement-job-posting-serivce/README.md)
- [Exercise 08 - Understand data masking, what is anonymization and pseudonymization](./exercises/08-data-masking-and-anonymization/README.md)
- [Optional Exercise 09 - Prompt Engineering with AI Launchpad](./exercises/09-prompt-engineering-with-ai-launchpad/)

The instructor will start you on the first exercise, and that's the only one you should do. You should only proceed to the next exercise once the instructor tells you to.

For this CodeJam you are provided with a subaccount on SAP BTP. The subaccount is only available for the duration of this CodeJam.

## Frequently asked Questions

You can find a list of frequently asked questions in the [Frequently Asked Questions Document](./frequently-asked-questions.md)

## Further Learning on AI

### YouTube Videos
- [What are AI Agents?](https://www.youtube.com/watch?v=bWYA8S54T14)
- [SAP Business AI: Explore AI Across Your Business](https://youtube.com/playlist?list=PL3ZRUb1AKkpTarpiocxrL3JKnX8Da6YCB&si=Ck8wuB78GmbV3MUA)
- [2 Minutes of AI@SAP](https://youtube.com/playlist?list=PL6RpkC85SLQD3XOnWmm_sMC3_Ks_KWy3V&si=LxNeGj8zXCc46eR9)
- [SAP Business AI - SAP Developers](https://youtube.com/playlist?list=PL6RpkC85SLQCDxe58RfZaLCcPqcgwTIhj&si=DyZn64TF_oYyuOrY)
- [Transformers (how LLMs work) explained visually | DL5 by 3Blue1Brown](https://www.youtube.com/watch?v=wjZofJX0v4M)
- [But what is a neural network? | Deep learning chapter 1](https://www.youtube.com/watch?v=aircAruvnKk)

### Learning
- [SAP Business AI - learning.sap.com](https://learning.sap.com/search?query=SAP+Business+AI&page=1&access=free)

### Customer & Partner projects

- [SAP Content Discovery - Artificial Intelligence](https://content-discovery.int.sap/asset-explore/57a1f804-c7aa-454d-9bde-7eb67872f034/product-sub-categories_3937994e-19f8-4db9-901d-eb9db5b45c85?contentCategoryIds=CUSTOMER_REFERENCE&categoryItemIds=product-sub-categories_3937994e-19f8-4db9-901d-eb9db5b45c85)

## Feedback

If you can spare a couple of minutes at the end of the session, please provide feedback to help us improve next time.

Use this [Give feedback](https://github.com/SAP-samples/codejam-cap-llm/issues/new?assignees=&labels=feedback&template=session-feedback-template.md&title=Session%20Feedback) link to create a special "feedback" issue, and follow the instructions in there.

Thank you!

## Other CodeJams

### CodeJam repositories

- [Service integration with SAP Cloud Application Programming Model](https://github.com/SAP-samples/cap-service-integration-codejam)
- [CodeJam - Getting Started with Machine Learning using SAP HANA and Python](https://github.com/SAP-samples/hana-ml-py-codejam)
- [Hands-on with the btp CLI and APIs](https://github.com/SAP-samples/cloud-btp-cli-api-codejam)
- [CodeJam - Combine SAP Cloud Application Programming Model with SAP HANA Cloud to Create Full-Stack Applications](https://github.com/SAP-samples/cap-hana-exercises-codejam)
- [All CodeJams in one list](https://github.com/orgs/SAP-samples/repositories?language=&q=Codejam&sort=&type=all)

### CodeJam Community

- [SAP CodeJam Events](https://community.sap.com/t5/sap-codejam/eb-p/codejam-events)
- [SAP CodeJam Community](https://community.sap.com/t5/sap-codejam/gh-p/code-jam)
- [SAP CodeJam Discussions](https://community.sap.com/t5/sap-codejam-discussions/bd-p/code-jamforum-board)

## Acknowledgements

The exercise content in this repository is based on a sample repository created by the CAP team.

## How to obtain support

Support for the content in this repository is available during the CodeJam event for which this content has been designed.

## License

Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0, except as noted otherwise in the [LICENSE](LICENSE) file.
