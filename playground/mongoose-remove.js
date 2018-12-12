const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose.js");
const { Todo } = require("./../server/models/todo.js");

Todo.findOneAndRemove({
  text: "new todo"
})
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
