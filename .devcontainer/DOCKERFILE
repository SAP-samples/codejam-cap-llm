# syntax=docker/dockerfile:1

ARG VARIANT="18"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# Install cf CLI

USER node
RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo apt-key add -
RUN echo "deb https://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list
RUN sudo apt-get update
RUN sudo apt-get install cf8-cli

# Install hana-cli gloablly
USER node
RUN npm install -g hana-cli