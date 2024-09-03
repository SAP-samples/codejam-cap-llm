# Exercise 05 - Learn how to use the destination service on SAP BTP to provide connection details for SAP AI Core

SAP BTP can route requests to different services provided by BTP, your applications and services, and even on-premise systems. For that, it can use the destination service. The destination service allows for configuring and creating destinations pointing to an API endpoint. A destination is a configuration file written in JSON with information about the target API URL, which allows for configuring authentication parameters to authenticate requests against such endpoints. A destination is a convenient way of routing requests towards a system. BTP secures the destination and allows application instances to connect/ bind against a destination. Such binding happens through issuing a service key for that destination. For example, suppose a developer wants to use a destination within a CAP application. You can bind the application and destination service on BTP via the `cds bind` command using the CDS CLI. 

In the following exercise, you will learn:

* How do you configure such a destination on BTP.
* How do you bind your CAP application against that destination.

Destinations can be configured on different levels within BTP, but for this use case, they are created within the Destination Service for the provided subaccount.

Our destination for this CodeJam is already pre-configured because all workshop attendees use it. Nevertheless, the [SAP BTP set up guide](../../btp-setup-guide.md) provides instructions on entitling your BTP account to use and configure a new destination within the destination service.

## Understand how a destination for SAP AI Core is being configured

Your CAP application will use a destination on SAP BTP to connect to the Generative AI Hub instance. You'll be able to explore what information is configured in the destination and how you bind your CAP application to that destination for the CAP-LLM-Plugin to send HTTP requests against Generative AI Hub.

Let's start by exploring the pre-configured destination on SAP BTP. You can find a quick look from the destination configuration below:

You should configure the destination for a typical SAP AI Core connection like this: 


| Property Name          | Value                   | Example                                                                |
| ---------------------- |:-----------------------:| ---------------------------------------------------------------------- |
| Name                   | <free to choose>        | ai_core_dest                                                           |
| Type                   | HTTP                    | -                                                                      |
| Description            | <free to choose>        | my SAP AI Core Destination                                             |
| URL                    | <AI_API_URL>            | https://api.ai.prod.us-east-1.aws.ml.hana.ondemand.com                 |
| Proxy Type             | Internet                | -                                                                      |
| Authentication         | OAuth2ClientCredentials | -                                                                      |
| Client ID              | <clientid>              | -                                                                      |
| Client Secret          | <clientsecret>          | -                                                                      |
| Token Service URL Type | Dedicated               | -                                                                      |
| Token Service URL      | <url>/oauth/token       | https://cap-ai-codejam-op5zdddw2.authentication.us10.hana.ondemand.com/oauth/token |

Feel free to explore the destination on SAP BTP yourself:

👉 Go to the [CodeJam subaccount on SAP BTP]()

👉 Open the <b>Instances & Subscriptions</b> page through the sidebar navigation.

👉 Under the section <b>Instances</b>, you can find the `cap-ai-codejam-dev` Destination Service instance. Click on the instance link.

![destination-service-codejam-instance](../05-explore-destination-service/assets/01-destination-service-codejam-instance.png)

👉 The destination service should open in a separate tab in your browser. Open the Destinations view over the sidebar navigation.

👉 In the list of destinations, you should see only one destination `codejam-ai-dest`. Click on it.

![set-up-destination-create-dest](../../assets/set-up-destination/4-set-up-destination-create-dest.png)

As you can see, the configuration mirrors the information from the table above. PLEASE do not change the destination's configuration or click on **Edit** because this will delete the authentication information from the destination and ruin the experience for the other attendees. Let us know if you already clicked it so we can fix it 😉.

After setting up the destination, you can check the connection to see if you have done everything correctly. You can safely ignore an odd <b>404</b> in the <b>Connection successful</b> message.

As you can see above, you need the `AI API URL` pointing to your SAP AI Core instance's endpoint. The authentication defines `OAuth2ClientCredentials`; The client ID, client secret, and token service URL are in the service key for the SAP AI Core instance.

![set-up-destination-create-dest](../05-explore-destination-service/assets/02-ai-core-service-key.png)

## Create a binding from your local CAP project to the destination

Your CAP application needs to be binding to the configured destination to send requests through the destination to the SAP AI Core instance of the subaccount. The binding is a trust between your application, the destination service, and, respectively, the configured destination. If you bind your application, a service key gets generated that authorizes your application to connect to the destination. It would be best if you first authorized against the BTP subaccount using the Cloud Foundry CLI. If the authorization is successful, you can access the different service instances for the assigned subaccount. Having that, you can create bindings against these services using the CLI. If you create a binding, a service key is issued granting your application or any other service to connect to the bound service instance. That will allow you to connect against the SAP AI Core destination described in the previous section. A result of that binding is the creation, or if already existent, the entry of a configuration of that binding in the `.cdsrc-private.json` file.

The `.cdsrc.json` or `.cdsrc-private.json` file is just one of many configuration files you can use within your CAP application. This file is for user-specific configurations that can be used across multiple projects. You could also add the binding configuration to a `.env` file if you want that configuration to be available only in the project environment. If you want to read more about the different configuration files, you can find a link to the documentation in this exercise's Further Reading section.

👉 Open the project in SAP Business Application Studio (BAS) or VSCode.

👉 Open a new terminal if not already open.

👉 Log into the provided Cloud Foundry instance and authenticate using the provided credentials:

```bash
cf login
```

![bind-destination-service-cf-login](./assets/01-bind-destination-service-cf-login.png)

You must look up the instance's name before you can bind the CAP application to the destination service. You can do this via the SAP BTP UI or the CLI.

👉 In the terminal, enter the following command to list all services for that subaccount:

```bash
cf services
```

![bind-destination-service-cf-services](./assets/02-bind-destination-service-cf-services.png)

👉 Copy the service name `cap-ai-codejam-dev`

Now that you have the name of the service against which you want to bind your application, you can use the CDS CLI to create the binding.

👉 In the terminal, enter the following command to create the binding (replace the placeholder with a meaningful name):

```bash
cds bind -2 cap-ai-codejam-dev:<your-service-key-name>
```

![bind-destination-service-cds-bind](./assets/03-bind-destination-service-cds-bind.png)

To see the binding configuration, you can open the `.cdsrc-private.json` file.

![bind-destination-service-binding](./assets/04-bind-destination-service-binding.png)

If you look at the configuration, you can see a field for the service key. You can also find that service key in the service instance on the SAP BTP UI. Alternatively, you can use the `cf cli` to fetch the existing service keys for the destination service.

```bash
cf service-keys cap-ai-codejam-dev
```

![bind-destination-service-service-keys](./assets/05-bind-destination-service-service-keys.png)

> You might see multiple service keys. With this exercise, your fellow attendees created a service key for their application, causing various entries in the service key list.

With the service key, the binding created, and the binding configuration in place, your application can now connect to the destination service of the CodeJam subaccount.

> You will create the needed connection configuration for the CAP-LLM-Plugin in exercise [09 Create the CAP-LLM-Plugin connection configuration](../09-create-connection-configuration/README.md). Please do not skip ahead.

## Summary

At this point, you have learned more about the destination service, how to configure a destination for connecting to Generative AI Hub, and how to bind to the destination service instance using the cds CLI.

## Further reading

* [User-Specific Defaults in ~/.cdsrc.json](https://cap.cloud.sap/docs/node.js/cds-env#user-specific-defaults-in-cdsrc-json)
* [Service Bindings](https://cap.cloud.sap/docs/node.js/cds-connect#service-bindings)
* [Create and bind a Destination Service instance](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/create-and-bind-destination-service-instance)
* [Set Up Tools to Connect With and Operate SAP AI Core - Tutorial](https://developers.sap.com/tutorials/ai-core-setup..html)

---

[Next exercise](../06-define-db-schema/README.md)
