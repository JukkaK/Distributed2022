const todoService = require('../functions/services/stock');
// only for local testing
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.res = {
        status: 200,
        body: todoService.getItems(context)
    };
};