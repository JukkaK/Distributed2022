import { AzureFunction, Context } from "@azure/functions"

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<void> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]); 
    const response = await fetch('https://func-distributed-dbapi-we-001.azurewebsites.net/api/db', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json --verbose'},
        body:JSON.stringify({document: mySbMsg})
        });
    return await response.json();
};

export default serviceBusQueueTrigger;
