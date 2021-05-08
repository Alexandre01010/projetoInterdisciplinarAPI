const db = require("../models/db.js");
const Proposta = db.proposta;
const candidaturaVar = db.candidatura

const { Op } = require("sequelize")

exports.findAllProposal = (req, res) => {
  Proposta.findAll(req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Ocorreu um erro ao encontrar propostas",
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
          message: err.message || "Ocorreu um erro ao criar a proposta."
        });
    });
};

exports.deleteProposal = (req, res) => {
  Proposta.destroy({ where: { id_proposta: req.params.proposalID } })
    .then(num => {
      if (num == 1) {
        res.status(200).json({
          message: `A proposta com o id ${req.params.proposalID} foi apagada com sucesso!`
        });
      } else {
        res.status(404).json({
          message: `Não foi encontrada nenhuma proposta com o id=${req.params.proposalID}.`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Ocorreu um erro ao apagar a proposta com o id=${req.params.proposalID}.`
      });
    });
};

exports.getOne = (req, res) => {
  Proposta.findByPk(req.params.proposalID)
    .then(data => {
      if (data === null)
        res.status(404).json({
          message: `Não foi encontrada nenhuma proposta com o id ${req.params.proposalID}.`
        });
      else
        res.json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: `Ocorreu um erro ao encontrar a proposta com o id ${req.params.proposalID}.`
      });
    });
};

// exports.findFiltered = (req, res) => {
//   Proposta.findAndCountAll({ where: { email: req.params.type, id_tipo_estado: req.params.state, titulo: req.params.searchText}})
//     .then(data => {
//       const response = getPagingData(data, offset, limit);
//       res.status(200).json(response);
//     })
//     .catch(err => {
//       res.status(500).json({
//         message:
//           err.message || "Some error occurred while retrieving proposals."
//       });
//     });
// };
