var mongoose = require("mongoose");

// Telling mongoose that it should use promises which are built in, not any 3rd party promises
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports.mongoose = mongoose;
