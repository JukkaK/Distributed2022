import { AzureFunction, Context } from "@azure/functions"
import axios from 'axios';

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<Object> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]); 
    context.log("db api url to call: " + process.env["DBAPI_URL"]);
    context.log("eg uri: " + process.env["MyEventGridTopicUriSetting"]);
    context.log("DB PUT DATA: ", mySbMsg);
    context.log("Context: ", context);
    context.log("MessageID: ", context.bindingData.messageId);
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
                    data: "event-data",                    
                }


            return response

          });    
        
          return "nope"  
    }
    
    

export default serviceBusQueueTrigger;
