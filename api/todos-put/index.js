const todoService = require('../functions/services/todo');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && req.body.task) {
        
        var timeStamp = new Date().toISOString();

        context.bindings.outputEvent = {
            id: 'message-id',
            subject: 'subject-name',
            dataVersion: '1.0',
            eventType: 'event-type',
            data: "event-data",
            eventTime: timeStamp
        };
        
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