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
var egTopicName = 'evgt-${projectName}-${shortLocation}-001'

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

module workers 'funcapp.bicep' = {
  scope: backendRg
  name: 'rg-${projectName}-backend-${shortLocation}-001'
  params: {
    location: location
    cosmoscs: cosmosdb.outputs.cs
  }
}

module eg 'eventgrid.bicep' = {
  scope: messageRg
  name: '${egTopicName}-${buildtag}'
  params: {
    egName: egTopicName
    location: location
  }
}
