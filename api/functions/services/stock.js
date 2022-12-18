const data = require('./data.js');

module.exports = {
    getItems: function(context) {
        try {
            const vacations = data.getITems();
            context.res.status(200).json(vacations);
          } catch (error) {
            context.res.status(500).send(error);
        }
    },
    editItems: function(context) {
        try {
            const response = data.editItems(context.req.body.task);
            context.res.status(200).json(response);
          } catch (error) {
            context.res.status(500).send(error);
        }
    }
}