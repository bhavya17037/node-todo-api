const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to mongodb server");
    }
    console.log("Connected to mongodb server!");

    // Note: toArray() here returns a promise
    // db.collection("Todos")
    //   .find({
    //     _id: new ObjectID("5c0f7d0ba0289d3ee3aa587a")
    //   })
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log("Todos");
    //       console.log(JSON.stringify(docs, undefined, 2));
    //     },
    //     err => {
    //       console.log("Could not fetch todos,", err);
    //     }
    //   );

    db.collection("Todos")
      .find()
      .count()
      .then(
        count => {
          console.log(`Todos count: ${count}`);
        },
        err => {
          console.log("Could not return count");
        }
      );

    //c db.close();
  }
);
