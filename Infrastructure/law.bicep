param location string = 'westeurope'

resource law 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {  
  name: 'law-distributed-we-001'
  location: location
}

output id string = law.id
