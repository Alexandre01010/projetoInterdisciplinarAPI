const db = require("../models/db.js");
const User = db.user;

exports.findAllUsers = (req, res) => {
    User.findAll(req.body)
      .then(data => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          message:
            err.message || "Some error occurred while retrieving users",
        });
      });
  }