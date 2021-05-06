const db = require("../models/db.js");
const User = db.user;

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

exports.findUser = (req, res) => {
  User.findByPk(req.params.userID)
    .then(data => {
      if (data === null)
        res.status(404).json({
          message: `Not found User with id ${req.params.userID}.`
        });
      else
        res.json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: `Error retrieving User with id ${req.params.userID}.`
      });
    });
};

exports.editUser = (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Request body can not be empty!" });
    return;
  }
  User.findByPk(req.params.userID)
    .then(user => {
      if (user === null)
        res.status(404).json({
          message: `Not found User with id ${req.params.userID}.`
        });
      else {
        User.update(req.body, { where: { id_user: req.params.userID } })
          .then(num => {
            if (num == 1) {
              res.status(200).json({
                message: `User id=${req.params.userID} was updated successfully.`
              });
            } else {
              res.status(200).json({
                message: `No updates were made on User id=${req.params.userID}.`
              });
            }
          })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Error updating User with id=${req.params.userID}.`
      });
    });
};

exports.deleteUser = (req, res) => {
  User.destroy({ where: { id_user: req.params.userID } })
    .then(num => {
      if (num == 1) {
        res.status(200).json({
          message: `User with id ${req.params.userID} was successfully deleted!`
        });
      } else {
        res.status(404).json({
          message: `Not found User with id=${req.params.userID}.`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Error deleting User with id=${req.params.userID}.`
      });
    });
};

exports.findByType = (req, res) => {
  if (req.query.idTipoUser) {
    console.log("entrou")
    User.findAll({ where: { id_tipo_user: req.query.idTipoUser } })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  }
  else{
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
} 