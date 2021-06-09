const { tema, resposta } = require("../models/db.js");
const db = require("../models/db.js");
const Tema = db.tema;
const Forum = db.forum;
const Resposta = db.resposta;

exports.findRespostas = (req, res) => {
  Tema.findByPk(req.params.temaID)
    .then((data) => {
      if (data === null) {
        res.status(404).json({
          message: `Não foram encontrados temas para tema  ${req.params.temaID}.`,
        });
      } else {
        Resposta.findAll({ where: { id_tema: req.params.temaID } })
          .then((rep) => {
            if (rep.length != 0) {
              res.status(200).json(rep);
            } else {
              res.status(404).json({
                message: "Não há respostas associadas",
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              message: err.message || "Ocorreu um erro ao encontrar respostas",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Erro ao responder um tema com id  ${req.params.temaID}.`,
      });
    });
};

exports.delete = (req, res) => {
  Tema.destroy({ where: { id_tema: req.params.temaID } })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: `Tema com id ${req.params.temaID} foi eliminado!`,
        });
      } else {
        res.status(404).json({
          message: `Nao foi encontrado nenhum tema com id=${req.params.temaID}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Erro ao eliminar tema com id=${req.params.temaID}.`,
      });
    });
};

exports.update = (req, res) => {
  // validate request body data
  if (!req.body || !req.body.titulo || !req.body.id_user) {
    res.status(400).json({ message: "Existem campos vazios na mensagem" });
    return;
  }

  Tema.findByPk(req.params.temaID)
    .then((data) => {
      if (data === null)
        res.status(404).json({
          message: `Não foi encontrado nenhum tema for tema com id  ${req.params.temaID}.`,
        });
      else {
        Tema.update(req.body, { where: { id_tema: req.params.temaID } }).then(
          (num) => {
            // check if one comment was updated (returns 0 if no data was updated)
            if (num == 1) {
              res.status(200).json({
                message: `Tema id=${req.params.temaID} foi atulizado com sucesso.`,
              });
            } else {
              res.status(200).json({
                message: `Não foram feitas alterações em tema id=${req.params.temaID}.`,
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Erro ao responder um tema com id  ${req.params.temaID}.`,
      });
    });
};

exports.findByID = (req, res) => {
  Tema.findByPk(req.params.temaID)
    .then((data) => {
      if (data === null) {
        res.status(404).json({
          message: `Não foram encontrados temas para tema  ${req.params.temaID}.`,
        });
      } else res.json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Erro ao responder um tema com id  ${req.params.temaID}.`,
      });
    });
};

exports.findByForum = (req, res) => {
  Forum.findByPk(req.params.forumID).then((forum) => {
    if (forum == null) {
      res.status(404).json({
        message:
          "Não foi encontrado um forum com id " + req.params.forumID + ".",
      });
    } else {
      Tema.findAll({ where: { id_forum: req.params.forumID } })
        .then((data) => {
          console.log(data);
          if (data === null || data.length == 0)
            res.status(404).json({
              message: `Não foram encontrados temas para forumID  ${req.params.forumID}.`,
            });
          else res.json(data);
        })
        .catch((err) => {
          res.status(500).json({
            message: `Erro ao responder temas com  forum id  ${req.params.forumID}.`,
          });
        });
    }
  });
};

exports.create = (req, res) => {
  Forum.findByPk(req.params.forumID).then((forum) => {
    if (forum == null) {
      res.status(404).json({
        message:
          "Não foi encontrado um forum com id " + req.params.forumID + ".",
      });
    } else {
      Tema.create({
        id_forum: req.params.forumID,
        id_user: req.body.id_user,
        titulo: req.body.titulo,
      })
        .then((data) => {
          res.status(201).json({
            message: "Novo tema criado",
            location: `/foruns/${req.params.forumID}/temas/`,
          });
        })
        .catch((err) => {
          if (err.name === "SequelizeValidationError")
            res.status(400).json({ message: err.errors[0].message });
          else
            res.status(500).json({
              message: err.message || "Ocorreu um erro ao criar o tema.",
            });
        });
    }
  });
};
