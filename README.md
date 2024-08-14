# Expose capabilities of SAP AI Core with the SAP Cloud Application Programming Model

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/cap-ai-vector-engine-sample)](https://api.reuse.software/info/github.com/SAP-samples/codejam-cap-llm)

## Description

This repository contains the material for the "Expose SAP AI Core capabilities with the SAP Cloud Application Programming Model" CodeJam, which the SAP Developer Advocates brought to you.

## Overview

This CodeJam introduces attendees to aspects of exposing generative artificial intelligence (genAI) capabilities to execute tasks in a business context.

During this event, you'll become acquainted with the theory behind genAI and SAP AI Core and learn how to use the SAP Cloud Application Programming Model to expose AI capabilities through your own service application.

While working through the exercises, you'll become comfortable creating CDS-based service definitions and integrating them into the SAP Business Technology Platform (BTP) and SAP AI Core Foundation Models.

![end2end-solution-diagram](../assets/architecture/End2End_Vector_Embedding_Solution_Diagram.png)

## Session prerequisites

Certain prerequisites must be sorted out before the day of the CodeJam in order to get the most from this CodeJam and work through the exercises.

The prerequisites are detailed in a separate [prerequisites](prerequisites.md) file. Please ensure you have everything ready before attending the CodeJam.

## Exercises

These are the exercises, each in their directory, sometimes with supporting files and scripts. We will work through the exercises in the order shown here. From a session flow perspective, we are taking the "coordinated" approach:

* [Exercise 01 - Set up your workspace](./exercises/01-set-up-workspace/README.md)
* [Exercise 02 - Use SAP AI Launchpad to deploy a Large Language Model with Generative AI Hub on SAP AI Core](./exercises/02-deploy-llm-ailaunchpad/README.md)
* [Exercise 03 - Explore Generative AI Hub in SAP AI Launchpad](./exercises/03-explore-genai-hub/README.md)
* [Exercise 04 - Explore the SAP HANA Cloud Vector Engine](./exercises/04-explore-sap-hana-cloud-vector-engine/README.md)
* [Exercise 05 - Learn how to use the destination service on SAP BTP to provide connection details for SAP AI Core](./exercises/05-explore-destination-service/README.md)
* [Exercise 06 - Create the database schema for the CAP application](./exercises/06-define-db-schema/README.md)
* [Exercise 07 - Define the embeddings service](./exercises/07-define-embedding-service/README.md)
* [Exercise 08 - Implement the embedding service](./exercises/08-implement-embedding-service/README.md)
* [Exercise 09 - Create the CAP-LLM-Plugin connection configuration](./exercises/09-create-connection-configuration/README.md)
* [Exercise 10 - Define the CAP documentation helper service](./exercises/10-define-cap-doc-helper-service/README.md)
* [Exercise 11 - Implement the CAP documentation helper service](./exercises/11-implement-cap-doc-helper-service/README.md)


The instructor will start you on the first exercise, and that's the only one you should do. You should only proceed to the next exercise once the instructor tells you to.

## Feedback

If you can spare a couple of minutes at the end of the session, please provide feedback to help us improve next time.

Use this [Give feedback](https://github.com/SAP-samples/codejam-cap-llm/issues/new?assignees=&labels=feedback&template=session-feedback-template.md&title=Session%20Feedback) link to create a special "feedback" issue, and follow the instructions in there.

Thank you!

## Other CodeJams

### CodeJam repositories

* [Service integration with SAP Cloud Application Programming Model](https://github.com/SAP-samples/cap-service-integration-codejam)
* [CodeJam - Getting Started with Machine Learning using SAP HANA and Python](https://github.com/SAP-samples/hana-ml-py-codejam)
* [Hands-on with the btp CLI and APIs](https://github.com/SAP-samples/cloud-btp-cli-api-codejam)
* [CodeJam - Combine SAP Cloud Application Programming Model with SAP HANA Cloud to Create Full-Stack Applications](https://github.com/SAP-samples/cap-hana-exercises-codejam)
* [All CodeJams in one list](https://github.com/orgs/SAP-samples/repositories?language=&q=Codejam&sort=&type=all)

### CodeJam Community

* [SAP CodeJam Events](https://community.sap.com/t5/sap-codejam/eb-p/codejam-events)
* [SAP CodeJam Community](https://community.sap.com/t5/sap-codejam/gh-p/code-jam)
* [SAP CodeJam Discussions](https://community.sap.com/t5/sap-codejam-discussions/bd-p/code-jamforum-board)

## Acknowledgements

The exercise content in this repository is based on a sample repository created by the CAP team.

## How to obtain support

Support for the content in this repository is available during the CodeJam event for which this content has been designed.

## License

Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0, except as noted otherwise in the [LICENSE](LICENSE) file.
