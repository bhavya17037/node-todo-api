const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to mongodb server");
    }
    console.log("Connected to mongodb server!");

    // db.collection("Todos")
    //   .deleteMany({ text: "something to do" })
    //   .then(
    //     result => {
    //       console.log(result);
    //     },
    //     err => {
    //       console.log("Could not delete the objects!", err);
    //     }
    //   );

    // db.collection("Todos")
    //   .deleteOne({ text: "lol man" })
    //   .then(
    //     result => {
    //       console.log(result);
    //     },
    //     err => {
    //       console.log("Could not delete the object!", err);
    //     }
    //   );

    db.collection("Todos")
      .findOneAndDelete({ completed: false })
      .then(
        result => {
          console.log(result);
        },
        err => {
          console.log(err);
        }
      );

    // db.close();
  }
);
