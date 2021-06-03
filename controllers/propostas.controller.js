const db = require("../models/db.js");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Proposta = db.proposta;
const candidaturaVar = db.candidatura

const { Op } = require("sequelize")

exports.create = (req, res) => {
  let token = req.headers["x-access-token"]
  jwt.verify(token, config.secret, (err, decoded) => {
    req.loggedUserId = decoded.id
  });
  // Save Tutorial in the database
  Proposta.create({ titulo: req.body.titulo, objetivos: req.body.objetivos, resultados_esperados: req.body.resultados_esperados,
    outros_dados: req.body.outros_dados, plano_provisorio_trabalho: req.body.plano_provisorio_trabalho, 
    perfil_candidato_desejado: req.body.perfil_candidato_desejado,
    nome_tutor: req.body.nome_tutor, cargo_tutor: req.body.cargo_tutor, contato: req.body.contato, 
    recursos_necessarios: req.body.recursos_necessarios,
    id_prof_orientador: req.body.id_prof_orientador, id_user_autor: req.loggedUserId, id_tipo_estado: 1, 
    nome_entidade: req.body.nome_entidade, 
    morada_entidade: req.body.morada_entidade,
    codigo_postal: req.body.codigo_postal, email: req.body.email, msgRevisao: req.body.msgRevisao
   })
    .then(data => {
      res.status(201).json({ message: "Nova proposta criada", location: "/propostas/" + data.id_proposta });
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError')
        res.status(400).json({ message: err.errors[0].message });
      else {
        if (err.errors[0].message === "PRIMARY must be unique") {
          res.status(500).json({ message: "Já existe essa proposta" })
        } else {
          res.status(500).json({
            message: err || "Ocorreu um erro ao criar uma candidatura à proposta " + req.params.proposalID
          })
        }
      }
    });
};

// exports.deleteProposal = (req, res) => {
//   Proposta.destroy({ where: { id_proposta: req.params.proposalID } })
//     .then(num => {
//       if (num == 1) {
//         res.status(200).json({
//           message: `A proposta com o id ${req.params.proposalID} foi apagada com sucesso!`
//         });
//       } else {

//         res.status(404).json({
//           message: `Não foi encontrada nenhuma proposta com o id ${req.params.proposalID}.`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({
//         message: `Ocorreu um erro ao apagar a proposta com o id ${req.params.proposalID}.`
//       });
//     });
// };

exports.deleteProposal = (req, res) => {
  let token = req.headers["x-access-token"]
  jwt.verify(token, config.secret, (err, decoded) => {
    req.loggedUserId = decoded.id
  });
  Proposta.findByPk(req.params.proposalID)
    .then((prop) => {
      if (prop === null) {
        res.status(404).json({
          message: "Proposta " + req.params.proposalID + " não existe"
        })
      } else {
        Proposta.destroy({ where: { id_proposta: req.params.proposalID } })
          .then((data) => {
            if (data == 1) {
              res.status(200).json({
                message: "Proposta " + req.params.proposalID + " foi eliminada com sucesso"
              })
            }
          })
          .catch((err) => {
            if (err.name === "SequelizeForeignKeyConstraintError") {
              res.status(500).json({
                message: "Não foi possivel eliminar a proposta com id " + req.params.proposalID + " pois tem candidaturas associadas"
              })
            }

          })
      }
    })
}

//Get de propostas falta a validação de que apenas pode retornas as rotas aprovadas

//Entidades externas não podem ver propostas de entidade de externas

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

exports.findPropostasFiltered = (req, res) => {
  if (req.query.type || req.query.state || req.query.text) {
    const whitelist = ['type', 'state', 'text'];
    let condition = {};
    Object.keys(req.query).forEach(function (key) {
        if (!whitelist.includes(key))
            return; //inform user of BAD REQUEST           
        if (key == "type"){
          if (req.query[key] == "estagio"){
            condition.email = { [Op.not]: null }
          }else{
            if (req.query[key] == "projeto"){
              condition.email = { [Op.is]: null }
            }
          }          
        }
        if (key == "text")
            condition.titulo = { [Op.like]: `%${req.query[key]}%` }
        if (key == "state"){
            condition.id_tipo_estado = parseInt(req.query[key])
        }
    });
    Proposta.findAll({
      where: condition
    })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({
          message:
            err.message || "Ocorreu um erro ao encontrar propostas"
        });
      });
  }
  else {
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
}
