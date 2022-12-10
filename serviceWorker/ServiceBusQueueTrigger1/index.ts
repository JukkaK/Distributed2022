import { AzureFunction, Context } from "@azure/functions"
import axios from 'axios';

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<Object> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]); 
    context.log("db api url to call: " + process.env["DBAPI_URL"]);
        await axios({
        method: 'PUT',
        //url:'https://func-distributed-dbapi-we-001.azurewebsites.net/api/db',
        url:process.env["DBAPI_URL"],        
        data: {mySbMsg}
        }).then(function (response) {
            context.log("DB PUT succeeded:" + response);
            return response
          });
        
          context.log("DB PUT failed in: " + process.env["WEBSITE_SITE_NAME"]);
        
          return "nope"  
    }
    
    

export default serviceBusQueueTrigger;
