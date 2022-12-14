@description('Location for resources. Default is West Europe.')
param location string = 'westeurope'
@description('Event Grid name.')
param egName string
param lawId string = ''

resource eg 'Microsoft.EventGrid/topics@2022-06-15' = {
  name: egName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
}

// resource eg_diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
//   name: '${egName}-law'
//   properties: {
//     workspaceId: lawId
//   }
//   scope: eg
// }
