var mongoose = require("mongoose");

var User = mongoose.model("User", {
  email: {
    type: String,
    trim: true,
    required: true,
    minlength: 1
  }
});

module.exports = {
  User: User
};
