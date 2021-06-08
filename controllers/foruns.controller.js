const db = require("../models/db.js");
const Foruns = db.forum;
const userForum = db.forumUser
const User = db.user
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
        if (data === null || data.count == 0) {
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

// exports.findAll = (req, res) => {
//   Foruns.findAll(req.body)
//     .then((data) => {
//       if (data === null) {
//         res.status(404).json({
//           message: `Não foi encontrado nenhum forum.`,
//         });
//       } else {
//         res.status(200).json(data);
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err.message || "Ocorreu um erro a obter foruns",
//       });
//     });
// };
exports.findAll = (req, res) => {
  let foruns = []
  if (req.query.texto) {
    userForum.findAll({ where: { id_user: req.loggedUserId } })
      .then((data) => {
        if (data.length != 0) {
          for (let i = 0; i < data.length; i++) {
            foruns.push(data[i].id_forum)
          }
        }
        Foruns.findAll({ where: { [Op.and]: [{ titulo: { [Op.like]: `%${req.query.texto}%` } }, { [Op.or]: [{ id_forum: { [Op.in]: foruns } }, { id_user: req.loggedUserId }] }] } })
          .then((prop) => {
            if (prop.length != 0) {
              res.status(200).json(prop)
            } else {
              res.status(404).json({
                message: "Não há foruns associados"
              })
            }
          })
          .catch((err) => {
            res.status(500).json({
              message:
                err.message || "Ocorreu um erro ao encontrar foruns",
            });
          })
      })
  } else {
    userForum.findAll({ where: { id_user: req.loggedUserId } })
      .then((data) => {
        if (data.length != 0) {
          for (let i = 0; i < data.length; i++) {
            foruns.push(data[i].id_forum)

          }
        }
        Foruns.findAll({ where: { [Op.or]: [{ id_forum: { [Op.in]: foruns } }, { id_user: req.loggedUserId }] } })
          .then((prop) => {
            if (prop.length != 0) {
              res.status(200).json(prop)
            } else {
              res.status(404).json({
                message: "Não há foruns associados"
              })
            }
          })
          .catch((err) => {
            res.status(500).json({
              message:
                err.message || "Ocorreu um erro ao encontrar foruns",
            });
          })
      })
  }
}

exports.addParticipante = (req, res) => {

  Foruns.findByPk(req.params.forumID)
    .then(forum => {
      // no data returned means there is no Entrevista in DB with that given ID 
      if (forum === null)
        res.status(404).json({
          message: `Não foi encontrada um forum com o id ${req.params.forumID}.`
        });
      else {
        User.findByPk(req.params.idParticipante)
          .then(user => {
            // no data returned means there is no User in DB with that given ID 
            if (user === null)
              res.status(404).json({
                message: `Não foi encontrado um utilizador com o id ${req.params.idParticipante}.`
              });
            else {
              if (forum.id_user == req.params.idParticipante) {
                res.status(400).json({
                  message: "O user já pertence à entrevista como participante"
                })
              } else {
                user.addForum(forum)
                  .then(data => {

                    if (data === undefined)
                      res.status(200).json({
                        message: `Utilizador ${req.params.idParticipante} já está associado a um forum ${req.params.forumID}.`
                      });
                    else
                      res.status(200).json({
                        message: `Adicionado o utilizador ${req.params.idParticipante} ao forum ${req.params.forumID}.`
                      });
                  })
              }
            }
          })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message || `Erro ao adicionar o utilizador ${req.params.idParticipante} ao forum ${req.params.forumID}.`
      });
    });

}

exports.create = (req, res) => {
  // Save forum in the database
  Foruns.create({ titulo: req.body.titulo, id_user: req.loggedUserId, data_hora: new Date().getTime(), gostos: 0, texto: req.body.texto })
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
