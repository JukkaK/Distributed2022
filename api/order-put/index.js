require('dotenv').config()
const { ServiceBusClient } = require("@azure/service-bus");

//This is the backend API function hosted in the Azure Static Web Apps. It's an Azure Function App with limitations, so we can't
//use any meaningful output bindings here. Inbound binding in function.json is http and it's resevered for the react single page app.

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    console.log("-------------------------------")
    context.log("SBconnectionString: " + process.env.SBconnectionString);
    console.log("-------------------------------")
    context.log("queueName: " + process.env.queueName);
    console.log("-------------------------------")
    
    if (req.body && req.body.task) {

     //Fetch configuration from the SWA configuration (created manually) and initiate connection to Service Bus.
      const sbClient = new ServiceBusClient(process.env.SBconnectionString);
      const sender = sbClient.createSender(process.env.queueName);
      
      //Construct message from request sent by the frontend.
      const message = { ean: req.body.task.ean, name: req.body.task.name, amount: req.body.task.amount }            
      //Send message to Service Bus
      await sender.sendMessages({
        body: message
      });
        console.log("viesti on", message)
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