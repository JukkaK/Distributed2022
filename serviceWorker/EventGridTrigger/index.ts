import { AzureFunction, Context } from "@azure/functions"

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log(typeof eventGridEvent);
    context.log(eventGridEvent);

    context.bindings.tableBinding = [];

    context.bindings.tableBinding.push({
        PartitionKey: "Test",
        RowKey: "1",
        Name: "Name"
    });    

};

export default eventGridTrigger;
