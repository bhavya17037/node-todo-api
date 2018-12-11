// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to mongodb server");
    }
    console.log("Connected to mongodb server!");

    // db.collection("Todos").insertOne(
    //   {
    //     text: "something to do",
    //     completed: false
    //   },
    //   (err, result) => {
    //     if (err) {
    //       return console.log("Could not save todo");
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //   }
    // );

    // db.collection("Users").insertOne(
    //   {
    //     name: "Bhavya Srivastava",
    //     age: "20",
    //     location: "Toronto"
    //   },
    //   (err, result) => {
    //     if (err) {
    //       return console.log("Could not save user");
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2)); //;
    //   }
    // );

    db.close();
  }
);
