@description('Location for resources. Default is West Europe.')
param location string = 'westeurope'
param buildtag string = utcNow()
//location shortener function
var shortLocation = {
  'westeurope': 'we'
  'northeurope': 'ne'
  'eastus': 'eus'
}[location]

//Set deployment scope to subscription
targetScope = 'subscription'

var projectName = 'distributed'
var dbName = 'cosmon-${projectName}-${shortLocation}-001'
var aiName = 'appi-${projectName}-${shortLocation}-001'
var planName = 'asp-${projectName}-${shortLocation}-001'
var funcName = 'func-${projectName}-${shortLocation}-001'
var egTopicNameFront = 'evgt-${projectName}-front-${shortLocation}-001'
var egTopicNameDist = 'evgt-${projectName}-workers-${shortLocation}-001'
var sbName = 'sb-${projectName}-${shortLocation}-001'

var locations = [
  'westeurope'
  'northeurope'
  'eastus'
]

resource dataRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-data-${shortLocation}-001'
  location: location
}

resource dataRg2 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-data-${shortLocation}-002'
  location: location
}

resource backendWeRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-backend-we-001'
  location: 'westeurope'
}

resource backendNeRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-backend-ne-001'
  location: 'northeurope'
}

resource backendEusRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-backend-eus-001'
  location: 'eastus'
}

resource messageRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-message-${shortLocation}-001'
  location: location
}

resource messageRg2 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-message-${shortLocation}-002'
  location: location
}

module cosmosdb 'cosmosdb.bicep' = {
  scope: dataRg
  name: '${dbName}-${buildtag}'
  params: {
    collection1Name: 'warehouseitems'
    region: location
  }
}

module ai 'ai.bicep' = {
  scope: backendWeRg
  name: 'ai-${buildtag}'
}

module dbapi 'funcapp.bicep' = {
  scope: dataRg
  name: 'dbapi'
  params: {
    location: location
    cosmoscs: cosmosdb.outputs.cs
    aiKey: ai.outputs.aiKey
    appName: 'dbapi'   
  }
}

module dbapifuncs 'funcapp.bicep' = [for item in locations: {
  scope: dataRg2
  name: 'dbapi-${item}'
  params: {
    location: item
    cosmoscs: cosmosdb.outputs.cs
    aiKey: ai.outputs.aiKey
    appName: 'dbapi-${item}' 
  }
}]

module workersWE 'funcapp.bicep' = {
  scope: backendWeRg
  name: 'backendWe'
  params: {
    location: 'westeurope'
    cosmoscs: cosmosdb.outputs.cs
    serviceBusConnectionString: servicebus.outputs.serviceBusConnectionString
    aiKey: ai.outputs.aiKey
    appName: 'backend'   
  }
}
module workersNE 'funcapp.bicep' = {
  scope: backendNeRg
  name: 'backendNe'
  params: {
    location: 'northeurope'
    cosmoscs: cosmosdb.outputs.cs
    serviceBusConnectionString: servicebus.outputs.serviceBusConnectionString
    aiKey: ai.outputs.aiKey
    appName: 'backend'   
  }
}

module workersEus 'funcapp.bicep' = {
  scope: backendEusRg
  name: 'backendEus'
  params: {
    location: 'eastus'
    cosmoscs: cosmosdb.outputs.cs
    serviceBusConnectionString: servicebus.outputs.serviceBusConnectionString
    aiKey: ai.outputs.aiKey
    appName: 'backend'   
  }
}

module servicebus 'servicebus.bicep' = {
  scope: messageRg2
  name: '${sbName}-${buildtag}'
  params: {
    sbName: sbName
    location: location
  }
}
