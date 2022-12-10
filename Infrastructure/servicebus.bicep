@description('Location for resources. Default is West Europe.')
param location string = 'westeurope'
@description('Event Grid name.')
param sbName string
param lawId string = ''

resource sb 'Microsoft.ServiceBus/namespaces@2022-01-01-preview' = {
  name: sbName
  location: location
}

resource serviceBusNamespace_diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${sbName}-law'
  properties: {
    workspaceId: lawId
  }
  scope: sb
}

resource sbq 'Microsoft.ServiceBus/namespaces/queues@2022-01-01-preview' = {
  name: '${sbName}-front-queue'
  parent: sb
  properties: {
    defaultMessageTimeToLive: 'PT2H5S'
  }
}

var serviceBusEndpoint = '${sb.id}/AuthorizationRules/RootManageSharedAccessKey'

output serviceBusConnectionString string = listKeys(serviceBusEndpoint, sb.apiVersion).primaryConnectionString
