const db = require("../models/db.js");
const Tema = db.tema;
const Forum = db.forum;

exports.update = (req, res) => {
  // validate request body data
  if (!req.body || !req.body.titulo || !req.body.id_forum || !req.body.id_user) {
    res.status(400).json({ message: "Request body can not be empty!" });
    return;
  }

  Tema.findByPk(req.params.temaID)
    .then((data) => {
      if (data === null && Number.isInteger(req.params.temaID))
        res.status(404).json({
          message: `Not found temas for tema  ${req.params.temaID}.`,
        });
      else if (data === null && !Number.isInteger(req.params.temaID)) {
        res.status(404).json({
          message: `Tema id needs to be a number.`,
        });
      }
      else {
        Tema.update(req.body, { where: { id_tema: req.params.temaID } })
          .then(num => {
            // check if one comment was updated (returns 0 if no data was updated)
            if (num == 1) {
              res.status(200).json({
                message: `Tema id=${req.params.temaID} was updated successfully.`
              });
            } else {
              res.status(200).json({
                message: `No updates were made on tema id=${req.params.temaID}.`
              });
            }
          })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error retrieving tema for tema id  ${req.params.temaID}.`,
      });
    });

};

exports.findByID = (req, res) => {

  Tema.findByPk(req.params.temaID)
    .then((data) => {
      if (data === null && Number.isInteger(req.params.temaID))
        res.status(404).json({
          message: `Not found temas for tema  ${req.params.temaID}.`,
        });
      else if (data === null && !Number.isInteger(req.params.temaID)) {
        res.status(404).json({
          message: `tema id needs to be a number .`,
        });
      } else
        res.json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error retrieving tema for tema id  ${req.params.temaID}.`,
      });
    });



};

exports.findByForum = (req, res) => {

  Forum.findByPk(req.params.forumID)
    .then(forum => {
      if (forum == null) {
        res.status(404).json({
          message: "Não foi encontrado um forum com id " + req.params.forumID + "."
        })
      } else {
        Tema.findAll({ where: { id_forum: req.params.forumID } })
          .then((data) => {
            if (data === null || data.length == 0)
              res.status(404).json({
                message: `Not found temas for forumID  ${req.params.forumID}.`,
              });

            else
              res.json(data);
          })
          .catch((err) => {
            res.status(500).json({
              message: `Error retrieving tema for forum id  ${req.params.forumID}.`,
            });
          });
      }
    })

};

exports.create = (req, res) => {
  Forum.findByPk(req.params.forumID)
    .then(forum => {
      if (forum == null) {
        res.status(404).json({
          message: "Não foi encontrado um forum com id " + req.params.forumID + "."
        })
      } else {
        Tema.create({ id_forum: req.params.forumID, id_user: req.body.id_user, titulo: req.body.titulo })
          .then((data) => {
            res
              console.log(res)
              .status(201)
              .json({
                message: "Novo tema criado",
                location: `/foruns/${req.params.forumID}/temas/` + res.id_forum,
              });
          })
          .catch((err) => {
            if (err.name === "SequelizeValidationError")
              res.status(400).json({ message: err.errors[0].message });
            else
              res.status(500).json({
                message:
                  err.message || "Some error occurred while creating the tema.",
              });
          });
      }
    }        // Save Tutorial in the database

    )
}
