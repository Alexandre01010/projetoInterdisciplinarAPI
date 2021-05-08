const db = require("../models/db.js");
const Foruns = db.forum;

const { Op, where } = require("sequelize");

exports.findByUser = (req, res) => {
  if (req.query.text) {
    //if contem o codigo para a rota /foruns/:userId?text=:searchText
    Foruns.findAndCountAll({
      where: {
        id_user: req.params.userID,
        titulo: { [Op.like]: "%" + req.query.text + "%" },
      },
    })
      .then((data) => {
        if (data === null||data.count==0) {
          res.status(404).json({
            message: `Não foi encontrado nenhum forum para a pesquisa.`,
          });
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        res.status(500).json({
          message:
            err.message || "Ocorreu um erro a obter forum por id de user.",
        });
      });
  } else {
    Foruns.findAll({ where: { id_user: req.params.userID } })
      .then((data) => {
        if (data === null || data.length == 0)
          res.status(404).json({
            message: `Não foi encontrado nenhum forum para user id  ${req.params.userID}.`,
          });
        else res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          message: `Ocorreu um erro a obter forums por user id  ${req.params.userID}.`,
        });
      });
  }
};

exports.findAll = (req, res) => {
  Foruns.findAll(req.body)
    .then((data) => {
      if (data === null) {
        res.status(404).json({
          message: `Não foi encontrado nenhum forum.`,
        });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Ocorreu um erro a obter foruns",
      });
    });
};
exports.create = (req, res) => {
  // Save forum in the database
  Foruns.create(req.body)
    .then((data) => {
      res.status(201).json({
        message: "Novo forum criado",
        location: "/foruns",
      });
    })
    .catch((err) => {
      if (err.name === "SequelizeValidationError")
        res.status(400).json({ message: err.errors[0].message });
      else
        res.status(500).json({
          message: err.message || "Ocorreu um erro a criar forum.",
        });
    });
};
