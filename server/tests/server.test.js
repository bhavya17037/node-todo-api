const expect = require("expect");
const request = require("supertest");

const { ObjectID } = require("mongodb");
const { app } = require("./../server.js");
const { Todo } = require("./../models/todo.js");
const { dummy, populateTodos, users, populateUsers } = require("./seed/seed");
const { User } = require("./../models/user.js");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create new todo", done => {
    var text = "new todo (test)";
    request(app)
      .post("/todos")
      .send({ text: text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text: text })
          .then(
            todos => {
              expect(todos.length).toBe(1);
              expect(todos[0].text).toBe(text);
              done();
            },
            e => {}
          )
          .catch(error => {
            done(error);
          });
      });
  });

  it("should not create new todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({ text: "" })
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(
            todos => {
              expect(todos.length).toBe(2);
              done();
            },
            e => {}
          )
          .catch(error => {
            done(error);
          });
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return todo doc", done => {
    var id = dummy[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(dummy[0].text);
      })
      .end(done);
  });

  it("should return 404 status for todo not found", done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 status for invalid id", done => {
    var id = "123";
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete todo", done => {
    var id = dummy[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(dummy[0].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo).toNotExist();
            done();
          })
          .catch(error => {
            return done(error);
          });
      });
  });

  it("should return 404 for invalid id", done => {
    var id = "123";
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for id not found", done => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the completed field", done => {
    var id = dummy[0]._id.toHexString();
    var text = "tompu candy";
    request(app)
      .patch(`/todos/${id}`)
      .send({ text: text, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    var id = dummy[1]._id.toHexString();
    var text = "tompu bompu";
    request(app)
      .patch(`/todos/${id}`)
      .send({ text: text, completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());

        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 when not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", done => {
    var email = "example@example.com";
    var password = "123mnb!";
    request(app)
      .post("/users")
      .send({
        email,
        password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then(user => {
            expect(user).toExist();
            expect(user.password).toNotBe(password); //due to hashing
            done();
          })
          .catch(e => {
            return done(e);
          });
      });
  });
  it("should return validation errors", done => {
    request(app)
      .post("/users")
      .send({
        email: "bhabsdhabhs",
        password: "lololol"
      })
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", done => {
    request(app)
      .post("/users")
      .send({
        email: users[0].email,
        password: "lololol"
      })
      .expect(400)
      .end(done);
  });
});
