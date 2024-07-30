# Expose capabilities of SAP AI Core with the SAP Cloud Application Programming Model

## Description

This repository contains the material for the "Expose SAP AI Core capabilities with the SAP Cloud Application Programming Model" CodeJam, brought to you by the Developer Advocates at SAP.

## Overview

This CodeJam introduces attendees to aspects of exposing generative artificial intelligence (genAI) capabilities to execute tasks in a business context.

During this event, you'll become acquainted with the theory behind genAI, SAP AI Core and how you can use the SAP Cloud Application Programming Model to expose AI capabilities through your own service application.
In working through the exercises you'll become comfortable with creating CDS based service definitions, integration into SAP Business Technology Platform (BTP) and SAP AI Core Foundation Models.

## Session prerequisites

In order to get the most from this CodeJam, and to be able to work through the exercises, there are certain prerequisites that you must have sorted out before the day of the CodeJam.

The prerequisites are detailed in a separate [prerequisites](prerequisites.md) file. Please ensure you have everything ready before attending the CodeJam.

## Exercises

These are the exercises, each in their own directory, sometimes with supporting files and scripts. We will work through the exercises in the order shown here. From a session flow perspective, we are taking the "coordinated" approach:

The instructor will set you off on the first exercise, and that's the only one you should do; if you finish before others, there are some questions at the end of the exercise for you to ponder. Do not proceed to the next exercise until the instructor tells you to do so.

// Use Case: CAP Documentation embeddings, questions to the LLM w. Chat Client
1. Set up your workspace
1. Create SAP HANA Cloud with Vector Engine, create HDI container // theory, we already have that enabled, everyone uses their own HDI container **(Kevin & Nora)**
1. Configure the Generative AI Hub // we already have that enabled (they create own resource group and deployment) **(Nora)**
1. Experience Prompt Editor and work with Gen AI Hub **(Nora)**
1. Destination configuration // Destination is already created, Service Key, AI Core
1. Create AI connection configuration, cdsrc file, (maybe change embedding model to Google?)
1. Add service bindings for SAP HANA Cloud Vector Engine and Destination Service

CAP
1. Define the database schema
1. Define the embedding service **(Kevin)**. Talk about Langchain and Langchain package **(Nora)**
1. Implement the embedding service **(Kevin)**. What is chunking? What is important?  **(Nora)**
1. Understanding the UI
1. Connecting the services to the UI
1. Run CAP service locally, link deployment tutorial/ documentation

## Feedback

If you can spare a couple of minutes at the end of the session, please help us improve for next time by providing some feedback.

Simply use this [Give Feedback](https://github.com/SAP-samples/codejam-cap-llm/issues/new?assignees=&labels=feedback&template=session-feedback-template.md&title=Session%20Feedback) link to create a special "feedback" issue, and follow the instructions in there.

Thank you!

## Acknowledgements

The exercise content in this repository is based on a sample repository created by the CAP team.

## How to obtain support

Support for the content in this repository is available during the actual time of the CodeJam event for which this content has been designed.

## License

Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
