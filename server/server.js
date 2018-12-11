var express = require("express");
var bodyParser = require("body-parser");

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
      res.status(400).send(err);
    }
  );
});

app.listen(3000, () => {
  console.log("Yay! Node server is live on port 3000!");
});

module.exports = {
  app: app
};
