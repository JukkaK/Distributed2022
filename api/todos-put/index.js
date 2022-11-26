const todoService = require('../functions/services/todo');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log("MyEventGridTopicUriSetting: " + process.env["MyEventGridTopicUriSetting"]);

    if (req.body && req.body.task) {

        const { EventGridPublisherClient, AzureKeyCredential } = require("@azure/eventgrid");

        const client = new EventGridPublisherClient(
          process.env["MyEventGridTopicUriSetting"],
          "EventGrid",
          new AzureKeyCredential(process.env["MyEventGridTopicKeySetting"])
        );
        
        await client.send([
          {
            eventType: "Azure.Sdk.SampleEvent",
            subject: "Event Subject",
            dataVersion: "1.0",
            data: {
              hello: "world"
            }
          }
        ]);

        context.res = {
            status: 200,
            body: todoService.editTodos(context)
        };

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};