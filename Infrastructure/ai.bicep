var applicationInsightsName = 'ai-distributed-we-001'

@description('Location for all resources.')
param location string = resourceGroup().location

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {  
  name: applicationInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

output aiKey string = applicationInsights.properties.InstrumentationKey
