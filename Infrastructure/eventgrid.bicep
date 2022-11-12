@description('Location for resources. Default is West Europe.')
param location string = 'westeurope'
@description('Event Grid name.')
param egName string

resource eg 'Microsoft.EventGrid/topics@2022-06-15' = {
  name: egName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
}
