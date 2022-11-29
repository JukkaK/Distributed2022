const todoService = require('../functions/services/todo');
//const { EventGridPublisherClient, AzureKeyCredential } = require("@azure/eventgrid");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    /*    
    const client = new EventGridPublisherClient(
        process.env.MyEventGridTopicUriSetting,
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

    
    */  
    context.res = {
        status: 200,
        body: todoService.getTodos(context)
    };
};