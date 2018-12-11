const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to mongodb server");
    }
    console.log("Connected to mongodb server!");

    // db.collection("Todos")
    //   .findOneAndUpdate(
    //     {
    //       text: "eat lunch"
    //     },
    //     {
    //       $set: {
    //         completed: true
    //       }
    //     },
    //     {
    //       returnOriginal: false
    //     }
    //   )
    //   .then(
    //     result => {
    //       console.log(result);
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );

    db.collection("Users")
      .findOneAndUpdate(
        { name: "Yash Gupta" },
        {
          $set: {
            location: "Washington"
          },
          $inc: {
            age: 1
          }
        },
        {
          returnOriginal: false
        }
      )
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
