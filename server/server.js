var express = require("express");
var bodyParser = require("body-parser");
var { ObjectID } = require("mongodb");

var { mongoose } = require("./db/mongoose.js");
var { Todo } = require("./models/todo.js");
var { User } = require("./models/user.js");

var app = express();

app.use(bodyParser.json());

// Routes:
app.post("/todos", (req, res) => {
  var newtodo = new Todo({
    text: req.body.text
  });

  newtodo.save().then(
    doc => {
      res.send(doc);
    },
    err => {
      res.status(404).send(err);
    }
  );
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({
        todos: todos
      });
    },
    err => {
      res.status(404).send(err);
    }
  );
});

app.get("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        res.status(404).send();
      }

      res.send({
        todo: todo
      });
    })
    .catch(error => {
      res.status(400).send();
    });
});

app.listen(3000, () => {
  console.log("Yay! Node server is live on port 3000!");
});

module.exports = {
  app: app
};