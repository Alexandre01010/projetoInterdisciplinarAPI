const db = require("../models/db.js");
const Proposta = db.proposta;

const { Op } = require("sequelize")

exports.findAllProposal = (req, res) => {
  Proposta.findAll(req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving proposals",
      });
    });
}


exports.create = (req, res) => {
  // Save Tutorial in the database
  Proposta.create(req.body)
    .then(data => {
      res.status(201).json({ message: "Nova proposta criada", location: "/propostas/" + data.id_proposta });
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError')
        res.status(400).json({ message: err.errors[0].message });
      else
        res.status(500).json({
          message: err.message || "Some error occurred while creating the Proposta."
        });
    });
};

exports.deleteProposal = (req, res) => {
  Proposta.destroy({ where: { id_proposta: req.params.proposalID } })
    .then(num => {
      if (num == 1) {
        res.status(200).json({
          message: `Tutorial with id ${req.params.proposalID} was successfully deleted!`
        });
      } else {
        res.status(404).json({
          message: `Not found Tutorial with id=${req.params.proposalID}.`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Error deleting Tutorial with id=${req.params.proposalID}.`
      });
    });
};

exports.getOne = (req, res) => {
  // obtains only a single entry from the table, using the provided primary key
  Proposta.findByPk(req.params.proposalID)
    .then(data => {
      if (data === null)
        res.status(404).json({
          message: `Not found Tutorial with id ${req.params.proposalID}.`
        });
      else
        res.json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: `Error retrieving Tutorial with id ${req.params.proposalID}.`
      });
    });
};

exports.findFiltered = (req, res) => {
  Proposta.findAndCountAll({ where: { email: req.params.type, id_tipo_estado: req.params.state, titulo: req.params.searchText}})
    .then(data => {
      const response = getPagingData(data, offset, limit);
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
