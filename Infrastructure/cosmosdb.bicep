//params
@description('Cosmos DB account name')
param cosmosDBAccountName string = 'mongodb-${uniqueString(resourceGroup().id)}'
@description('The name for the first Mongo DB collection')
param collection1Name string
param region string = resourceGroup().location
param secondaryRegion string = 'northeurope'
param tertiaryRegion string = 'eastus'
param lawId string = ''

// Deployments - Cosmos DB Resources 
resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2022-08-15' = {
  name: toLower(cosmosDBAccountName)
  location: region
  kind: 'MongoDB'
  identity: {
    type:'SystemAssigned'
  }
  properties:{
    databaseAccountOfferType:'Standard'
    enableAutomaticFailover:true
    enableMultipleWriteLocations:true
    consistencyPolicy: {
      defaultConsistencyLevel: 'Eventual'
    }
    locations: [
      {
        locationName: region
        failoverPriority: 0
        isZoneRedundant: false
      }
      {
        locationName: secondaryRegion
        failoverPriority: 1
        isZoneRedundant: false
      }
      {
        locationName: tertiaryRegion
        failoverPriority: 2
        isZoneRedundant: false
      }               
    ]
    apiProperties: {
      serverVersion: '4.2'
    }
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2022-05-15' = {
  parent: cosmosDbAccount
  name: cosmosDBAccountName
  properties: {
    resource: {
      id: cosmosDBAccountName
    }
    options: {
      autoscaleSettings: {
        maxThroughput: 1000
      }
    }    
  }
}

//This nosql collection is not really used anywhere; test data has been craeted manually after deploying the IAC-code.
resource collection1 'Microsoft.DocumentDb/databaseAccounts/mongodbDatabases/collections@2022-05-15' = {
  parent: database
  name: collection1Name
  properties: {
    resource: {
      id: collection1Name
      shardKey: {
        user_id: 'Hash'
      }
      indexes: [
        {
          key: {
            keys: [
              '_id'
            ]
          }
        }
        {
          key: {
            keys: [
              '$**'
            ]
          }
        }
        {
          key: {
            keys: [
              'product_name'
              'product_amount'
            ]
          }
        }
      ]
    }
  }
}

//Do not do this in real life, just in course projects like this.
output cs string = listConnectionStrings(resourceId('Microsoft.DocumentDB/databaseAccounts', cosmosDBAccountName), '2022-05-15').connectionStrings[0].connectionString
