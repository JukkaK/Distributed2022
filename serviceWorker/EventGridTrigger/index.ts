import { AzureFunction, Context } from "@azure/functions"
import { TableClient, TableEntity, TableServiceClient } from '@azure/data-tables';
import { v4 as uuidv4 } from 'uuid';

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log(typeof eventGridEvent);
    context.log(eventGridEvent);
    context.log("Data: " + JSON.stringify(eventGridEvent.data));


    const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, "state");
    await tableClient.createTable();

    const entity = {
        partitionKey: "p1",
        //rowKey: uuidv4(),
        rowKey: JSON.stringify(eventGridEvent.data),
        date: new Date()
      };
    
      await tableClient.createEntity(entity);

};

export default eventGridTrigger;
