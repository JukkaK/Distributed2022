# Running locally

## Node 
```
npm install
```

### Core tools package is needed to run locally
```
npm install --global azure-functions-core-tools
```

## Config

### ./local.settings.json

``` 
 "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "CosmosDbConnectionString":""
  }

```

Connection string can be found from Azure > Resources > Azure Cosmos Db > Righ click db and select Copy connection string


## Running api

Just hit F5 in VScode while in the project folder.

To close shift + F5

## Calling api

### POST 
```
curl -X POST http://localhost:7071/api/db \
   -H 'Content-Type: application/json' \        
   -d '{"document":{"name":"Name", "saldo": Number}}' --verbose
```

### Get

Get all

```
curl -X GET http://localhost:7071/api/db \ 
   -H 'Content-Type: application/json' --verbose
```

Get by id 
```
curl -X GET http://localhost:7071/api/db \
   -H 'Content-Type: application/json' \
   -d '{"id":"DOCUMENT_ID"}' --verbose
```

### PUT

Update saldo
```
curl -X PUT http://localhost:7071/api/db \
   -H 'Content-Type: application/json' \
   -d '{"document":{"id": "DOCUMENT_ID", "order": Number}}' --verbose
```

### DELETE
```
curl -X DELETE http://localhost:7071/api/category \
   -H 'Content-Type: application/json' \
   -d '{"id":"DOCUMENT_ID"}' --verbose
```