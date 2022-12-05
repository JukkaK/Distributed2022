import { AzureFunction, Context } from "@azure/functions"
import axios from 'axios';

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<Object> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]); 

        await axios({
        method: 'PUT',
        url:'https://func-distributed-dbapi-we-001.azurewebsites.net/api/db',
        data: {mySbMsg}
        }).then(function (response) {
            return response
          });

        return "nope"  
    }
    
    

export default serviceBusQueueTrigger;
