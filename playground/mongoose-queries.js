const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose.js");
const { Todo } = require("./../server/models/todo.js");

var id = "5c0fd36e64a9fe39ffef7b5a";

if (!ObjectID.isValid(id)) {
  console.log("ID not valid!");
}
Todo.findById(id)
  .then(todo => {
    if (!todo) {
      return console.log("ID not found!");
    }
    console.log(todo);
  })
  .catch(error => {
    console.log("INVALID ID");
  });
