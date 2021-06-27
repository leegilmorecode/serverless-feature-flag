# Serverless Feature Flag

Basic feature flag example using aws app config and the serverless framework.

I have discussed this in the following [blog post](https://leejamesgilmore.medium.com/serverless-feature-flags-6e49d534e79f)

## Overview

This example repo shows how to use [AWS App Config](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) alongside the [Serverless Framework](https://www.serverless.com/) for the use of [Feature Flags](https://martinfowler.com/articles/feature-toggles.html). It takes advantage of the [App Config Extensions](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-lambda-extensions.html) to automatically integrate with App Config:

> An AWS Lambda extension is a companion process that augments the capabilities of a Lambda function. An extension can start before a function is invoked, run in parallel with a function, and continue to run after a function invocation is processed. In essence, a Lambda extension is like a client that runs in parallel to a Lambda invocation. This parallel client can interface with your function at any point during its lifecycle.

> If you use AWS AppConfig to manage configurations for a Lambda function, then we recommend that you add the AWS AppConfig Lambda extension. This extension includes best practices that simplify using AWS AppConfig while reducing costs. Reduced costs result from fewer API calls to the AWS AppConfig service and, separately, reduced costs from shorter Lambda function processing times.


## Why AppConfig?

The power of AWS App Config, which is part of AWS Systems Manager, comes from the ability to create, manage and deploy configurations across lambda. Typically with the use of AWS Parameter Store as an alternative, you either set the value once when deploying through the serverless framework, or you need to go to Parameter Store on every invocation.

Changing the value on the fly, for example for feature flags, is not easy to do without the limitations above.

Using the [App Config Lambda Extension](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-lambda-extensions.html) alongside App Config allows teams to very quickly and easily roll out configuration changes, and roll them back out again if required, without deploying any actual code.

## Deploy

To deploy the application run: ```npm run deploy:develop```

## How does the Lambda Extension work?

If you use AWS AppConfig to manage configurations for a Lambda function without Lambda extensions, then you must configure your Lambda function to receive configuration updates by integrating with the GetConfiguration API action. To call GetConfiguration you must create and pass the unique client ID and the ClientConfigurationVersion that corresponds to the configuration data from your function.

You would also need to set up a mechanism to periodically check for new configuration data when your function is invoked and manage a cache to provide configuration data between checks to the AWS AppConfig service.

Integrating the AWS AppConfig Lambda extension with your Lambda function simplifies this process. The following diagram shows how it works.

![image](https://docs.aws.amazon.com/appconfig/latest/userguide/images/AppConfigLambdaExtension.png)

1. You configure the AWS AppConfig Lambda extension as a layer of your Lambda function.

2. To retrieve its configuration data, your function calls the AWS AppConfig extension at an HTTP endpoint running on localhost:2772.

3. The extension maintains a local cache of the configuration data. If the data isn't in the cache, the extension calls AWS AppConfig to get the configuration data.

4. Upon receiving the configuration from the service, the extension stores it in the local cache and passes it to the Lambda function.

5. AWS AppConfig Lambda extension periodically checks for updates to your configuration data in the background. Each time your Lambda function is invoked, the extension checks the elapsed time since it retrieved a configuration. If the elapsed time is greater than the configured poll interval, the extension calls AWS AppConfig to check for newly deployed data, updates the local cache if there has been a change, and resets the elapsed time.


