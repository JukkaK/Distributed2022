import { AzureFunction, Context } from "@azure/functions"
import { TableClient, TableEntity, TableServiceClient } from '@azure/data-tables';
import { v4 as uuidv4 } from 'uuid';

//This is the function that consumes an event from Event Grid. It has an inbound Event Grid binding and outbound Storage Account
//table binding in function.json. Note that Event Grid subscriptions, which are created in the Event Grid for the functions, 
//have been created manually - creating them with IAC is a bit of a bother, as they need an existing and deployed resources.

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log(typeof eventGridEvent);
    context.log(eventGridEvent);
    context.log("Data: " + JSON.stringify(eventGridEvent.data));

    //Create a connection to Storage Accounts table services by using a connection string fetched from Func App configuration (created
    //with IAC code). Name of the table is hardcoded here.
    const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, "state");
    await tableClient.createTable();

    //Construct an entity with a service bus messageid sent by some node to Event Grid, and fetched here from the corresponding event
    //consumed by this node. MessageId is stored to the state-table as rowkey.
    const entity = {
        partitionKey: "p1",
        rowKey: eventGridEvent.data,
        date: new Date()
      };
    
      await tableClient.createEntity(entity);

};

export default eventGridTrigger;
