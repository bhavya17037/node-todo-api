require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

var { mongoose } = require("./db/mongoose.js");
var { Todo } = require("./models/todo.js");
var { User } = require("./models/user.js");

var app = express();
const port = process.env.PORT || 3000;

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

app.delete("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        res.status(404).send();
      }

      res.send({
        todo: todo
      });
    })
    .catch(err => {
      res.status(400).send();
    });
});

app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(
    id,
    {
      $set: body
    },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        res.status(404).send();
      }
      res.send({
        todo: todo
      });
    })
    .catch(err => {
      res.status(400).send();
    });
});

app.post("/users", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);
  var user = new User(body);

  user
    .save()
    .then(user => {
      return user.generateAuthToken(); // This would return a value, which can be used as success arg of then()
    })
    .then(token => {
      res.header("x-auth", token).send(user);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

app.listen(port, () => {
  console.log(`Yay! Node server is live on port ${port}!`);
});

module.exports = {
  app: app
};
