@description('Location for resources. Default is West Europe.')
param location string = 'westeurope'
@description('Event Grid name.')
param sbName string

resource sb 'Microsoft.ServiceBus/namespaces@2022-01-01-preview' = {
  name: sbName
  location: location
}

resource sbq 'Microsoft.ServiceBus/namespaces/queues@2022-01-01-preview' = {
  name: '${sbName}-front-queue'
  parent: sb
}

var serviceBusEndpoint = '${sb.id}/AuthorizationRules/RootManageSharedAccessKey'

output serviceBusConnectionString string = listKeys(serviceBusEndpoint, sb.apiVersion).primaryConnectionString
