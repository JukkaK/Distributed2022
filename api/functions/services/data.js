const data = {
    todos: [
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
    getToDos: function() {
        return data.todos;
    },
    editTodos: function(task) {
        data.todos = data.todos.map(todo => {
            if (todo.ean == task.ean) todo.amount = (todo.amount - task.amount);
            return {
              id: todo.id,
              ean: todo.ean,
              pic: todo.pic,
              name: todo.name,
              amount: todo.amount
          }
        });
        return {
            message: "task edited",
            tasks: data.todos
        }
    }
  }