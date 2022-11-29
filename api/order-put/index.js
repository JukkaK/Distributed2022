require('dotenv').config()
const { EventGridPublisherClient, AzureKeyCredential } = require("@azure/eventgrid");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    console.log("-------------------------------")
    context.log("MyEventGridTopicUriSetting: " + process.env.MyEventGridTopicUrlSetting);
    console.log("-------------------------------")
    context.log("MyEventGridTopicKeySetting: " + process.env.MyEventGridTopicKeySetting);
    console.log("-------------------------------")
    
    if (req.body && req.body.task) {

        const client = new EventGridPublisherClient(
          process.env.MyEventGridTopicUrlSetting,
          "EventGrid",
          new AzureKeyCredential(process.env.MyEventGridTopicKeySetting)
        );
        
        await client.send([
          {
            eventType: "Azure.Sdk.SampleEvent",
            subject: "Event Subject",
            dataVersion: "1.0",
            data: {
              ean: req.body.task.ean,
              name: req.body.task.name,
              amount: req.body.task.amount
            }
          }
        ]);

        context.res = {
            status: 200
        };

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};