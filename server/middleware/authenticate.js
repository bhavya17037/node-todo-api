var { User } = require("./../models/user.js");

//middleware for authentication
var authenticate = (req, res, next) => {
  var token = req.header("x-auth");

  User.findByToken(token)
    .then(user => {
      if (!user) {
        // This would take it directly to catch block
        return Promise.reject();
      }

      req.user = user;
      req.token = token;
      next();
      // Now this modified req would be used in app.get("/users/me")
    })
    .catch(err => {
      res.status(401).send();
    });
};

module.exports = {
  authenticate: authenticate
};
