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

resource dataRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-data-${shortLocation}-001'
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

module workersWE 'funcapp.bicep' = {
  scope: backendWeRg
  name: 'backendWe'
  params: {
    location: 'westeurope'
    cosmoscs: cosmosdb.outputs.cs
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
    aiKey: ai.outputs.aiKey
    appName: 'backend'   
  }
}

module egfront 'eventgrid.bicep' = {
  scope: messageRg
  name: '${egTopicNameFront}-${buildtag}'
  params: {
    egName: egTopicNameFront
    location: location
  }
}

module egworkers 'eventgrid.bicep' = {
  scope: messageRg
  name: '${egTopicNameDist}-${buildtag}'
  params: {
    egName: egTopicNameDist
    location: location
  }
}
