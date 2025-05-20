# Exercise 00 - Set up your workspace

_Estimated Time: **5 min**_

At the end of this exercise, you'll have an environment to work in for the duration of this CodeJam, and your environment of choice will load the contents of this repository.

## Table of Contents

- [Set up the environment and clone this repository](#set-up-the-environment-and-clone-this-repository)
  - [Primary environment: A Dev Space in the SAP Business Application Studio](#primary-environment-a-dev-space-in-the-sap-business-application-studio)
    - [Create a Dev Space](#create-a-dev-space)
    - [Clone this repository](#clone-this-repository)
  - [Alternative environment: VS Code and a container image](#alternative-environment-vs-code-and-a-container-image)
- [Navigate to the project folder](#navigate-to-the-project-folder)
- [Check the installation of the CDS development kit](#check-the-installation-of-the-cds-development-kit)
- [Install the NPM package dependencies](#install-the-npm-package-dependencies)
- [Summary](#summary)
- [Further reading](#further-reading)

## Set up the environment and clone this repository

To prepare the building blocks for this CodeJam, you'll need to clone this CodeJam repository and make its contents available in the workspace you chose. Your workspace will be a Dev Space in the SAP Business Application Studio or alternatively you can use VS Code with a dev container. Our recommendation for this workshop is to go with the SAP Business Application Studio approach.

Follow one of the two subsections here, as appropriate: either for a [primary environment](#primary-environment-a-dev-space-in-the-sap-business-application-studio) or for an [alternative environment](#alternative-environment-vs-code-and-a-container-image).

### Primary environment: A Dev Space in the SAP Business Application Studio

#### Create a Dev Space

👉 Via this [link](https://cap-ai-codejam-op6zhda1.us10cf.applicationstudio.cloud.sap/index.html) to the SAP Business Application Studio, create a new Dev Space, choosing the **Full Stack Cloud Application** type, ensure to select **SAP HANA Tools**, and if **SAP HANA Database Explorer** gets selected as well this is not a problem:

![Setting_up_a_dev_space](assets/create-full-stack-cloud-application-dev-space.png)

Choosing the **Full Stack Cloud Application** brings in some predefined extensions, as you can see from the screenshot, including a CDS Graphical Modeler and the CAP Tools. The **SAP HANA Tools** will allow you to interact with, deploy, and observe the SAP HANA Cloud instance that you will be using for working with the SAP HANA Cloud Vector Engine.

#### Clone this repository

👉 If the Dev Space is started and you're in it, use the **Clone from Git** option in the **Get Started** screen that appears to clone this repository. Follow the subsequent prompts to open the cloned repository; specify `https://github.com/SAP-samples/codejam-cap-llm.git` as the URL.

![Cloning the repo](assets/clone-the-codejam-repository.png)

Your Dev Space will reload after the repository is cloned.

### Alternative environment: VS Code and a container image

_Follow the **Primary environment** section above if you want to use a Dev Space in the SAP Business Application Studio._

👉 At a command prompt on your local machine, clone this repository into a directory of your choice, and then open VS Code, pointing to that newly cloned repository's directory:

```bash
git clone https://github.com/SAP-samples/codejam-cap-llm
code codejam-cap-llm
```

Once VS Code has started and opened the directory, it should notice the [dev container configuration file](../../.devcontainer/devcontainer.json) (in the [.devcontainer/](../../.devcontainer/) directory) and ask you if you want to reopen everything in a container, as shown in the screenshot. Confirm that you wish to do so by selecting the default answer, **Reopen in Container.**

> If this doesn't happen, check that you have the Dev Containers extension in VS Code - see the [corresponding prerequisites section](../../prerequisites.md#alternative-environment-vs-code-with-a-dev-container) section for details. You might also need to explicitly request this action, by opening the Command Palette and selecting **Dev Containers: Reopen in container**.

![The dialog prompting you to "Reopen in Container"](assets/reopen-in-container.png)

## Navigate to the project folder

To work through the exercises make sure you are in the project folder. To do so, use the terminal to change directory into `codejam-cap-llm/job-posting-service/`.

👉 From the root of the CodeJam repository `/home/user/projects/codejam-cap-llm` change the directory:

```bash
cd job-posting-service
```

## Check the installation of the CDS development kit

_This and subsequent steps apply to both the primary and alternative environments._

👉 Inside your dev container or your Dev Space, open a terminal using **Terminal: Create New Terminal** in the Command Palette, and at the prompt, check the version:

```bash
cds v
```

You should see that the CDS development kit is installed. Depending on your workspace, you'll see slightly different output, but it should generally look something like this:

```text
@cap-js/asyncapi: 1.0.3
@cap-js/db-service: 1.19.1
@cap-js/openapi: 1.2.1
@sap/cds: 8.9.1
@sap/cds-compiler: 5.9.2
@sap/cds-dk: 8.8.2
@sap/cds-dk (global): 8.8.2
@sap/cds-fiori: 1.4.1
@sap/cds-foss: 5.0.1
@sap/cds-mtxs: 2.7.1
@sap/eslint-plugin-cds: 3.2.0
Node.js: v22.13.1
codejam-cap-llm: 1.0.0
home: /extbin/globals/pnpm/5/.pnpm/@sap+cds@8.9.1_@eslint+js@9.24.0_express@4.21.2/node_modules/@sap/cds
```

> In case `cds` is **not** installed, run the following command from the Terminal:
>
```bash
npm i @sap/cds-dk -g
```

## Install the NPM package dependencies

You'll work primarily within the `project/job-posting-service` directory of this repo, which contains a starter CAP project with code already written to provide UI and some of the service functionalities to make the CodeJam experience more accessible. The `package.json` file contains runtime and design-time dependencies.

👉 Make sure you're in the `project/job-posting-service` directory (where `package.json` lives):

👉 Now install the dependencies thus:

```bash
npm install
```

You can double-check what's installed with `npm list`, which should show you something similar to this:

```text
codejam-cap-llm@1.0.0 /Users/CoolDude/Developer/GitHub/codejams/codejam-cap-llm/job-posting-service
├── @langchain/community@0.3.39
├── @langchain/textsplitters@0.1.0
├── @sap-ai-sdk/langchain@1.10.0
├── @sap-ai-sdk/orchestration@1.10.0
├── @sap-cloud-sdk/http-client@3.26.4
├── @sap/cds-dk@8.9.1
├── @sap/cds-hana@2.0.0
├── @sap/cds@8.9.1
├── cors@2.8.5
├── dotenv@16.4.7
└── eslint@9.24.0
```

No worries, we will talk about these dependencies later.

## Summary

At this point, you have an environment set up to work through the remaining exercises in this CodeJam, along with the repository contents and the CDS development kit installed and ready for use.

## Further reading

* [Developing CAP in containers - three ways](https://qmacro.org/blog/posts/2024/01/15/developing-cap-in-containers-three-ways/)
* [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers)
* [Cloning repositories](https://help.sap.com/docs/SAP%20Business%20Application%20Studio/9d1db9835307451daa8c930fbd9ab264/7a68bfa7111b44f6b1e78b51e803238c.html) in SAP Business Application Studio
* [The @sap/cds-dk package on NPM](https://www.npmjs.com/package/@sap/cds-dk)

---

[Next exercise](../01-explore-genai-hub/README.md)
