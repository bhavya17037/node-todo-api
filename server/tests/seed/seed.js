const { ObjectID } = require("mongodb");
const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: "lolman@gmail.com",
    password: "user1pass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, "abc123").toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "bhavyaisthebest@gmail.com",
    password: "user2pass"
  }
];

const dummy = [
  { _id: new ObjectID(), text: "first todo" },
  {
    _id: new ObjectID(),
    text: "second todo",
    completed: true,
    completedAt: 333
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(
      () => {
        // chaining promises
        return Todo.insertMany(dummy);
      },
      e => {}
    )
    .then(() => done(), e => {});
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      var user1 = new User(users[0]).save();
      var user2 = new User(users[1]).save();

      // Promise.all takes an array of promises, after which the attatched then callback does not fire unless both promises are returned
      return Promise.all([user1, user2]);
    })
    .then(() => {
      done();
    })
    .catch(e => {});
};

module.exports = {
  dummy,
  populateTodos,
  users,
  populateUsers
};
