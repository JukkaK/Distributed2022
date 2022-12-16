import { AzureFunction, Context } from "@azure/functions"

// Reference to the Azure Storage SDK
const azure = require('azure-storage');
// Reference to the uuid package which helps us to create 
// unique identifiers for our PartitionKey
const uuid = require('uuid/v1');
const STORAGE_CONNECTION_STRING = process.env.MyStorageConnectionAppSetting || "";
// The TableService is used to send requests to the database
const tableService = new azure.fromConnectionString(STORAGE_CONNECTION_STRING);
// Table created with bicep
const tableName = "state";

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log(typeof eventGridEvent);
    context.log(eventGridEvent);
    context.log("Data: " + JSON.stringify(eventGridEvent.data));

        // Adding PartitionKey & RowKey as they are required for any data stored in Azure Table Storage
        const item = eventGridEvent.data;
        item["PartitionKey"] = "Partition";
        item["RowKey"] = uuid();

        tableService.insertEntity(tableName, item, { echoContent: true }, function (error, result, response) {
            if (!error) {
                // This returns a 201 code + the database response inside the body
                // Calling status like this will automatically trigger a context.done()
                context.res.status(201).json(response);
            } else {
                // In case of an error we return an appropriate status code and the error returned by the DB
                context.res.status(500).json({ error: error });
            }
        });   

};

export default eventGridTrigger;
