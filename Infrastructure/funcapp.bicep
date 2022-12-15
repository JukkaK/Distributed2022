@description('The name of the function app that you wish to create.')
param appName string

@description('Storage Account type')
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
])
param storageAccountType string = 'Standard_LRS'

@description('Location for all resources.')
param location string = resourceGroup().location

@description('The language worker runtime to load in the function app.')
@allowed([
  'node'
  'dotnet'
  'java'
])
param runtime string = 'node'
@secure()
param cosmoscs string = ''
param aiKey string
@secure()
param serviceBusConnectionString string = ''
param dbapiUrl string = 'https://func-distributed-dbapi-we-001.azurewebsites.net/api/db'
@secure()
param egUri string = ''
@secure()
param egKey string = ''


//location shortener function
var shortLocation = {
  'westeurope': 'we'
  'northeurope': 'ne'
  'eastus': 'eus'
}[location]

var functionAppName = 'func-distributed-${appName}-${shortLocation}-001'

var storageAccountName = 'stgdist${appName}${shortLocation}002'
var functionWorkerRuntime = runtime

resource storage 'Microsoft.Storage/storageAccounts@2021-08-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageAccountType
  }
  kind: 'Storage'
  properties: {}
}

resource tables 'Microsoft.Storage/storageAccounts/tableServices@2021-09-01' = {
  name: 'default'
  parent: storageAccount
  properties: {}
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' existing = {
  name: storageAccountName

  resource tableServices 'tableServices@2021-09-01' existing = {
    name: 'default'
  }
}

resource table 'Microsoft.Storage/storageAccounts/tableServices/tables@2021-09-01' = {
  name: 'state'
  parent: storageAccount::tableServices
}

resource hostingPlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: 'plan-distributed-${appName}-${shortLocation}-001'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {}
}

resource functionApp 'Microsoft.Web/sites@2021-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(functionAppName)
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~14'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: aiKey
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: functionWorkerRuntime
        }
        {
          name: 'CosmosDbConnectionString'
          value: cosmoscs
        }
        {
          name: 'serviceBusConnectionString'
          value: serviceBusConnectionString
        }
        {
          name: 'DBAPI_URL'
          value: dbapiUrl
        }
        {
          name: 'MyEventGridTopicUriSetting'
          value: egUri
        }
        {
          name: 'MyEventGridTopicKeySetting'
          value: egKey
        }                   
      ]
      ftpsState: 'FtpsOnly'
      minTlsVersion: '1.2'
    }
    httpsOnly: true
  }
}


