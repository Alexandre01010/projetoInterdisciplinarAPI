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

exports.createUser = (req, res) => {
  User.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New User created.", location: "/users/" + data.id_user });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the User."
                });
        });
}