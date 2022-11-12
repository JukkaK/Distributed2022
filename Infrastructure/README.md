IaC-code goes here, in case there's time to implement that. Mostly to make it easy to deploy stuff to a new sub, and point out where things like node public ip's are set.

## Deploying infra

The current subscription in ad.helsinki.fi -tenant has limitations (we can't access the Active Directory), so possibility for automation are limited. Thus, the deployment currently has to be made from Azure Cli with user's permissions.

Deployment scope for this implementation is __subscription__, and resource groups are created within bicep implementation.

0. Install Azure cli

1. Login with Azure Cli

```
az login
```

2. Set the active subscription

```
az account set --subscription 3c462dc1-d33a-4f6c-b6e4-74d35b4b4abc
```

3. Run bicep deployment

```
az deployment create --location westeurope --template-file main.bicep
```