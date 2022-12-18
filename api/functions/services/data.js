//Initial test data for the front end. Not used anymore.
const data = {
    items: [
      {
        id: 1,
        ean: 1111,
        pic: 'gift1.png',
        name: 'gift one',
        amount: 25
      },
      {
        id: 2,
        ean: 2222,
        pic: 'gift2.png',
        name: 'gift two',
        amount: 10
      },
      {
        id: 3,
        ean: 3333,
        pic: 'gift3.png',
        name: 'gift three',
        amount: 25
      },      
    ]
  };

  module.exports = {
    getITems: function() {
        return data.items;
    },
    editItems: function(task) {
        data.items = data.items.map(item => {
            if (item.ean == task.ean) item.amount = (item.amount - task.amount);
            return {
              id: item.id,
              ean: item.ean,
              pic: item.pic,
              name: item.name,
              amount: item.amount
          }
        });
        return {
            message: "items edited",
            tasks: data.items
        }
    }
  }