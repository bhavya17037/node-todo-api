const expect = require("expect");
const request = require("supertest");

const { app } = require("./../server.js");
const { Todo } = require("./../models/todo.js");
//const { User } = require("./../models/user.js");

beforeEach(done => {
  Todo.remove({}).then(
    () => {
      done();
    },
    e => {}
  );
});

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
        Todo.find()
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
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(
            todos => {
              expect(todos.length).toBe(0);
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
