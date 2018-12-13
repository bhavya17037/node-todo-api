const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: value => {
        return validator.isEmail(value);
      },
      message: `{value} is not a valid email!`
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        require: true
      }
    }
  ]
});

// instance methods are defined in .methods

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";

  // Generating auth token
  var token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access: access
      },
      "abc123"
    )
    .toString();

  user.tokens = user.tokens.concat([
    {
      access: access,
      token: token
    }
  ]);

  return user.save().then(() => {
    return token;
  });
};

// model methods are defined in .statics

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, "abc123");
  } catch (e) {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  // findOne also returns a promise, so we are gonna return it to add some promise chaining
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

var User = mongoose.model("User", UserSchema);

module.exports = {
  User: User
};
