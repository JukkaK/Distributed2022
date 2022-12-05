require('dotenv').config()
//const { EventGridPublisherClient, AzureKeyCredential } = require("@azure/eventgrid");
const { ServiceBusClient } = require("@azure/service-bus");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    console.log("-------------------------------")
    context.log("SBconnectionString: " + process.env.SBconnectionString);
    console.log("-------------------------------")
    context.log("queueName: " + process.env.queueName);
    console.log("-------------------------------")
    
    if (req.body && req.body.task) {

      const sbClient = new ServiceBusClient(process.env.SBconnectionString);
      const sender = sbClient.createSender(process.env.queueName);
      
      context.log("sending with ean " + req.body.task.ean);

      const message = "{ean: " + req.body.task.ean + ", name: " + req.body.task.name + ", amount: " + req.body.task.amount + "}"

      await sender.sendMessages({
        body: message
      });
        context.log("sent message with ean " + req.body.task.ean);

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