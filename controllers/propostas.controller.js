const db = require("../models/db.js");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Proposta = db.proposta;
const candidaturaVar = db.candidatura
const User = db.user

const { Op } = require("sequelize");
const { proposta } = require("../models/db.js");

exports.create = (req, res) => {
  // Save Tutorial in the database
  Proposta.create({
    titulo: req.body.titulo, objetivos: req.body.objetivos, resultados_esperados: req.body.resultados_esperados,
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
        res.status(500).json({
          message: err || "Ocorreu um erro ao criar uma candidatura à proposta " + req.params.proposalID
        })
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

// exports.deleteProposal = (req, res) => {
//   Proposta.findByPk(req.params.proposalID)
//     .then((prop) => {
//       let autor = prop.id_user_autor
//       if (prop === null) {
//         res.status(404).json({
//           message: "Proposta " + req.params.proposalID + " não existe"
//         })
//       } else {
//         Proposta.destroy({ where: { id_proposta: req.params.proposalID } })
//           .then((data) => {
//             if (data == 1) {
//               res.status(200).json({
//                 message: "Proposta " + req.params.proposalID + " foi eliminada com sucesso"
//               })
//             }
//           })
//           .catch((err) => {
//             if (err.name === "SequelizeForeignKeyConstraintError") {
//               res.status(500).json({
//                 message: "Não foi possivel eliminar a proposta com id " + req.params.proposalID + " pois tem candidaturas associadas"
//               })
//             }

//           })
//       }
//     })
// }

exports.deleteProposal = (req, res) => {
  Proposta.findByPk(req.params.proposalID)
    .then((prop) => {
      if (prop === null) {
        res.status(404).json({
          message: "Proposta não encontrada"
        })
      } else {
        User.findByPk(prop.id_user_autor)
          .then((data) => {
            console.log(data.id_tipo_user)
            User.findByPk(req.loggedUserId)
              .then((isAdminVerify) => {
                if (prop.id_user_autor == req.loggedUserId || isAdminVerify.id_tipo_user == 1) {
                  Proposta.destroy({ where: { id_proposta: req.params.proposalID } })
                    .then((del) => {
                      if (del == 1) {
                        res.status(200).json({
                          message: "Proposta eliminada com sucesso!"
                        })
                      }
                    })
                } else {
                  res.status(403).json({
                    message: "Não podes eliminar esta proposta"
                  })
                }
              })
          })
      }
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Ocorreu um erro ao encontrar propostas",
      });
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
      if (key == "type") {
        if (req.query[key] == "estagio") {
          condition.email = { [Op.not]: null }
        } else {
          if (req.query[key] == "projeto") {
            condition.email = { [Op.is]: null }
          }
        }
      }
      if (key == "text")
        condition.titulo = { [Op.like]: `%${req.query[key]}%` }
      if (key == "state") {
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

exports.findApprovedProposals = (req, res) => {
  if (req.query.type || req.query.state || req.query.text) {
    const whitelist = ['type', 'state', 'text'];
    let condition = { id_tipo_estado: 3 };
    Object.keys(req.query).forEach(function (key) {
      if (!whitelist.includes(key))
        return; //inform user of BAD REQUEST           
      if (key == "type") {
        if (req.query[key] == "estagio") {
          condition.email = { [Op.not]: null }
        } else {
          if (req.query[key] == "projeto") {
            condition.email = { [Op.is]: null }
          }
        }
      }
      if (key == "text")
        condition.titulo = { [Op.like]: `%${req.query[key]}%` }
      if (key == "state") {
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
    Proposta.findAll({ where: { id_tipo_estado: 3 } })
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

exports.getMyPropostaFiltered = (req, res) => {
  if (req.query.type || req.query.state || req.query.text) {
    const whitelist = ['type', 'state', 'text'];
    let condition = { id_user_autor: req.loggedUserId };
    Object.keys(req.query).forEach(function (key) {
      if (!whitelist.includes(key))
        return; //inform user of BAD REQUEST           
      if (key == "type") {
        if (req.query[key] == "estagio") {
          condition.email = { [Op.not]: null }
          console.log(condition)
        } else {
          if (req.query[key] == "projeto") {
            condition.email = { [Op.is]: null }
          }
        }
      }
      if (key == "text")
        condition.titulo = { [Op.like]: `%${req.query[key]}%` }
      if (key == "state") {
        condition.id_tipo_estado = parseInt(req.query[key])
      }
    });
    Proposta.findAll({ where: condition })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({
          message:
            err.message || "Ocorreu um erro ao encontrar propostas"
        });
      });
  } else {
    console.log(req.loggedUserId)
    Proposta.findAll({
      where: { id_user_autor: req.loggedUserId }
    })
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

exports.ProposalForApproval = (req, res) => {
  let condition = { id_tipo_estado: 1 }
  Proposta.findAll({ where: condition })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Ocorreu um erro ao encontrar propostas",
      });
    })
}

exports.updateProposalState = (req, res) => {
  Proposta.findByPk(req.params.proposalID)
    .then((data) => {
      if (data === null) {
        res.status(404).json({
          message: "Não foi encontrado nenhuma proposta com esse id"
        })
      } else {
        Proposta.update({ id_tipo_estado: req.body.id_tipo_estado }, { where: { id_proposta: req.params.proposalID } })
          .then((prop) => {
            if (prop == 1) {
              res.status(200).json({
                message: "Estado da proposta alterado"
              })
            } else {
              res.status(404).json({
                message: "Proposta não encontrada"
              })
            }
          })
          .catch((err) => {
            res.status(500).json({
              message:
                err.message || "Ocorreu um erro ao encontrar propostas",
            });
          })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Ocorreu um erro ao encontrar propostas",
      });
    })
}

exports.updateProposal = (req, res) => {
  Proposta.findByPk(req.params.proposalID)
    .then((data) => {
      User.findByPk(req.loggedUserId)
        .then((us) => {
          if (us.id_tipo_user == 1) {
            Proposta.update(req.body, { where: { id_proposta: req.params.proposalID } })
              .then((prop) => {
                if (prop == 1) {
                  res.status(200).json({
                    message: "Proposta alterada com sucesso"
                  })
                }
              })
          } else {
            if (data.id_user_autor == req.loggedUserId) {
              Proposta.update(req.body, { where: { id_proposta: req.params.proposalID } })
                .then((prop) => {
                  if (prop == 1) {
                    res.status(200).json({
                      message: "Proposta alterada com sucesso"
                    })
                  }
                })
            } else {
              res.status(403).json({
                message: "Não podes alterar uma proposta que não é tua"
              })

            }
          }
        })
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Ocorreu um erro ao encontrar propostas",
      });
    })
}