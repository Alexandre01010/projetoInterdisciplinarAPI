const db = require("../models/db.js");
const User = db.user;

exports.createUser = (req, res) => {
  User.create(req.body)
    .then(data => {
      res.status(201).json({ message: "Novo utilizador criado.", location: "/users/" + data.id_user });
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError')
        res.status(400).json({ message: err.errors[0].message });
      else
        res.status(500).json({
          message: err.message || "Ocorreu um erro ao criar o utilizador"
        });
    });
}

exports.findUser = (req, res) => {
  User.findByPk(req.params.userID)
    .then(data => {
      if (data === null)
        res.status(404).json({
          message: `Não foi encontrado nenhum utilizador com id ${req.params.userID}.`
        });
      else
        res.json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: `Ocorreu um erro ao encontrar o utilizador com id ${req.params.userID}.`
      });
    });
};

exports.editUser = (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "O corpo do pedido não pode estar vazio!" });
    return;
  }
  User.findByPk(req.params.userID)
    .then(user => {
      if (user === null)
        res.status(404).json({
          message: `Não foi encontrado o user com o id ${req.params.userID}.`
        });
      else {
        User.update(req.body, { where: { id_user: req.params.userID } })
          .then(num => {
            if (num == 1) {
              res.status(200).json({
                message: `O utilizador com o id=${req.params.userID} foi atualizado com sucesso.`
              });
            } else {
              res.status(200).json({
                message: `Não foram feitas nenhumas alterações no user com id=${req.params.userID}.`
              });
            }
          })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Ocorreu um erro ao atualizar o utilizador com id=${req.params.userID}.`
      });
    });
};

exports.deleteUser = (req, res) => {
  User.destroy({ where: { id_user: req.params.userID } })
    .then(num => {
      if (num == 1) {
        res.status(200).json({
          message: `O utilizador com o id ${req.params.userID} foi apagado com sucesso!`
        });
      } else {
        res.status(404).json({
          message: `Não foi encontrado o utilizador com o id=${req.params.userID}.`
        });
      }
    })
    .catch(err => {
      if(err.name === "SequelizeForeignKeyConstraintError"){
        res.status(500).json({
          message: "Não foi possivel eliminar o utilizador " + req.params.userID + " pois tem candidaturas associadas"
        })
      }else{
        res.status(500).json({
          message: "Ocorreu um erro ao eliminar o utilizador " + req.params.userID
        })
      }
    });
};

exports.findByType = (req, res) => {
  if (req.query.idTipoUser) {
    if (req.query.idTipoUser.match(/^(1|2|3)$/g)){
      User.findAll({ where: { id_tipo_user: req.query.idTipoUser } })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({
          message:
            err.message || "Ocorreu um erro ao encontrar utilizadores"
        });
      });
    }
    else {
      res.status(400).json({ message: 'O valor do id tipo de user varia apenas entre 1 e 3' });
      return;
    }
  }
  else{
    User.findAll(req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Ocorreu um erro ao encontrar utilizadores",
      });
    });
  }
} 