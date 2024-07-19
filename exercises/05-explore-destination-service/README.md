# Exercise 05 - Learn how to use the destination service on SAP BTP to provide connection details for SAP AI Core

BTP can route requests to different services provided by BTP, your own, and even on-premise systems. For that, it uses the Destination Service. A destination is a configuration file written in JSON with information about the target URL and optional authentication information. It is convenient because it allows for simple routing of requests towards a system without bothering about authentication against that system. The destination also specifies who can use the destination to make the whole end-to-end connection secure.

A destination can be configured on different levels within BTP, but for this use case, destinations get created within the Destination Service for a given subaccount.

For a detailed description on how to enable the Destination Service, follow the [SAP BTP set up guide](../../btp-setup-guide.md).

## Understand how a new Destination for request routing to SAP Gen AI Hub works

Your CAP application will use a destination on SAP BTP to connect to the SAP generative AI Hub instance. The CAP-LLM-Plugin will construct a HTTP request and send it to the defined destination. The destination service will make sure that the request gets routed through to SAP AI Core and respectively to SAP Gen AI Hub.

> The destination is pre-configured for this CodeJam, because all of you will use the same destination for your requests. Reason for this is that we are using one central SAP AI Core instance with one source of truth defined in the destination. Nevertheless, let's take a look how that destination is constructed and how you would configure that yourself. You also have access to the destination service within the provided subaccount, you can take a look yourself. Please make sure to not change the destination because that could potentially compromise the configuration and destroy the experience for the other attendees 😉.

The destination for a typical SAP AI Core connection can be configured as following: 


| Property Name          | Value                   | Example                                                                |
| ---------------------- |:-----------------------:| ---------------------------------------------------------------------: |
| Name                   | <free to choose>        | ai_core_dest                                                           |
| Type                   | HTTP                    | -                                                                      |
| Description            | <free to choose>        | my SAP AI Core Destination                                             |
| URL                    | <AI_API_URL>            | https://api.ai.prod.us-east-1.aws.ml.hana.ondemand.com                 |
| Proxy Type             | Internet                | -                                                                      |
| Authentication         | OAuth2ClientCredentials | -                                                                      |
| Client ID              | <clientid>              | sb-e478287-ba9e-4223-98f5-c5579332rf55!b294456aicore@s345              |
| Client Secret          | <clientsecret>          | 49884e42q-45x6-154-54566545644564bvf56456465$46546TMKWn=               |
| Token Service URL Type | Dedicated               | -                                                                      |
| Token Service URL      | <url>                   | https://cap-ai-codejam-op5zdddw2.authentication.us10.hana.ondemand.com |

![set-up-destination-create-dest](../../assets/set-up-destination/4-set-up-destination-create-dest.png)

After setting up the destination, you can check the connection to see if you have done everything correctly. If a odd `404` appears within the `Connection successful` message, you can safely ignore that.

As you can see above, you need the `AI API URL` pointing to your SAP AI Core instance's endpoint. The authentication is defined as `OAuth2ClientCredentials` and the needed information for that can be found in the service key for the SAP AI Core instance.

You will take the destination's name and add it to a local configuration file within your CAP application. The CAP-LLM-Plugin can read that configuration to establish a safe connection to SAP AI Core.

