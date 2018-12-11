var mongoose = require("mongoose");

// Telling mongoose that it should use promises which are built in, not any 3rd party promises
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

module.exports.mongoose = mongoose;
