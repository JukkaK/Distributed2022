import { AzureFunction, Context } from "@azure/functions"
import axios from 'axios';
import { TableClient } from '@azure/data-tables';

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<Object> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]); 
    context.log("db api url to call: " + process.env["DBAPI_URL"]);
    context.log("eg uri: " + process.env["MyEventGridTopicUriSetting"]);
    context.log("DB PUT DATA: ", mySbMsg);
    context.log("Context: ", context);
    context.log("MessageID: ", context.bindingData.messageId);

    console.log("-----------start search--------------")

    const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, "state");
    
     let result = await tableClient.getEntity("state", context.bindingData.messageId)
        .catch((error) => {
            console.log("error", error);
        });
    console.log("Result: ", result)

    console.log("-----------stop search--------------")

    await axios({
        method: 'PUT',
        url:process.env["DBAPI_URL"],        
        data: {mySbMsg}
        }).then(function (response) {
            context.log("axios response: ", response.status);
                
            context.bindings.outputEvent = {
                id: 'message-id',
                subject: 'subject-name',
                dataVersion: '1.0',
                eventType: 'event-type',
                data: context.bindingData.messageId,                
            };
                context.log("sent event");

            return response

          });    
        
        return "nope"  
    }
    
    

export default serviceBusQueueTrigger;
