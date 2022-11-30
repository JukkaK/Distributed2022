@description('Location for resources. Default is West Europe.')
param location string = 'westeurope'
@description('Event Grid name.')
param sbName string

resource sb 'Microsoft.ServiceBus/namespaces@2022-01-01-preview' = {
  name: sbName
  location: location
}

var serviceBusEndpoint = '${sb.id}/AuthorizationRules/RootManageSharedAccessKey'
var serviceBusConnectionString = listKeys(serviceBusEndpoint, sb.apiVersion).primaryConnectionString
