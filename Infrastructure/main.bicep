@description('Location for resources. Default is West Europe.')
param location string = 'westeurope'
param buildtag string = utcNow()
//location shortener function
var shortLocation = {
  'westeurope': 'we'
  'northeurope': 'ne'
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

resource backendRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${projectName}-backend-${shortLocation}-001'
  location: location
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
  scope: backendRg
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

module workers 'funcapp.bicep' = {
  scope: backendRg
  name: 'backend'
  params: {
    location: location
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
