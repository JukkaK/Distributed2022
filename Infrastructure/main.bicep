//This is the entrypoint file for IAC deployment. All other bicep-files are modules referenced by this template.
@description('Location for resources. Default is West Europe.')
param location string = 'westeurope'
param buildtag string = utcNow()

//location shortener function for naming.
var shortLocation = {
  westeurope: 'we'
  northeurope: 'ne'
  eastus: 'eus'
}

//DB hints
var dblocation = {
  westeurope: 'West Europe'
  northeurope: 'North Europe'
  eastus: 'East US'
}

//Set deployment scope to subscription
targetScope = 'subscription'

var projectName = 'distributed'
var dbName = 'cosmos-${projectName}-we-001'
var sbName = 'sb-${projectName}-${shortLocation[location]}-001'
var egTopicName = 'evgt-${projectName}-${shortLocation[location]}-001'

//These are the regions we currenctly deploy to.
var locations = [
  'westeurope'
  'northeurope'
  'eastus'
]

//Resource groups where the resources are created.
resource messageRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-message-${shortLocation[location]}-001'
  location: location
}

resource dataRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-data-${shortLocation[location]}-001'
  location: location
}

resource dataRg2 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-data-${shortLocation[location]}-002'
  location: location
}

resource backendRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-backend-001'
  location: location
}

resource messageRg2 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-message-${shortLocation[location]}-002'
  location: location
}

//CosmosDB module. 
module cosmosdb 'cosmosdb.bicep' = {
  scope: dataRg2
  name: '${dbName}-${buildtag}'
  params: {
    collection1Name: 'warehouseitems'
    region: location
    cosmosDBAccountName: dbName
  }
}

//Application Insights
module ai 'ai.bicep' = {
  scope: backendRg
  name: 'ai-${buildtag}'
}

//Loop through locations and create a serviceWorker function app to every location. Takes in connection strings
//and other items needed for configuration.
module workerfuncs 'funcapp.bicep' = [for item in locations: {
  scope: backendRg
  name: 'serviceWorker-${item}'
  params: {
    location: item
    cosmoscs: cosmosdb.outputs.cs
    serviceBusConnectionString: servicebus.outputs.serviceBusConnectionString
    aiKey: ai.outputs.aiKey
    appName: 'backend'
    dbapiUrl: 'https://func-distributed-dbapi-${shortLocation[item]}-001.azurewebsites.net/api/db'
    egUri: eg.outputs.uri
    egKey: eg.outputs.key
  }
}]

//Loop through locations and create a dbApi function app to every location.
module dbfuncs 'funcappsdb.bicep' = [for item in locations: {
  scope: dataRg2
  name: 'dbApi-${item}'
  params: {
    location: item
    cosmoscs: '${cosmosdb.outputs.cs}${dblocation[item]}'
    aiKey: ai.outputs.aiKey
    appName: 'dbapi' 
  }
}]

//Service Bus 
module servicebus 'servicebus.bicep' = {
  scope: messageRg2
  name: '${sbName}-${buildtag}'
  params: {
    sbName: sbName
    location: location
    lawId: law.outputs.id
  }
}

//Log analytics workspace. Some services ship logs to this resource.
module law 'law.bicep' = {
  scope: backendRg
  name: 'lawWe'
  params: {
    location: location
  }
}

//Event Grid. Note that event grid subscriptions have been created manually after deploying the IAC.
module eg 'eventgrid.bicep' = {
  scope: messageRg
  name: '${egTopicName}-${buildtag}'
  params: {
    egName: egTopicName
    location: location
  }
}
