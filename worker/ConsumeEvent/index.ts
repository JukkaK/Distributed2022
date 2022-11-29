import { AzureFunction, Context } from "@azure/functions"

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log(typeof eventGridEvent);
    context.log(eventGridEvent);
    context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]); 
};

export default eventGridTrigger;
