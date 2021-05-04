const db = require("../models/db.js");
const Tema = db.tema;

exports.update = (req, res) => {
  // validate request body data
  if (!req.body || !req.body.titulo) {
      res.status(400).json({ message: "Request body can not be empty!" });
      return;
  }
  Tema.findByPk(req.params.temaID)
  .then((data) => {
    if (data === null)
      res.status(404).json({
        message: `Not found temas for tema  ${req.params.temaID}.`,
      });
    else {
      Tema.update(req.body,{where:{id_tema:req.params.temaID}})
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
      if (data === null)
        res.status(404).json({
          message: `Not found temas for tema  ${req.params.temaID}.`,
        });
      else res.json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error retrieving tema for tema id  ${req.params.temaID}.`,
      });
    });
};

exports.findByForum = (req, res) => {
  Tema.findAll({ where: { id_forum: req.params.forumID } })
    .then((data) => {
      if (data === null || data.length == 0)
        res.status(404).json({
          message: `Not found temas for forumID  ${req.params.forumID}.`,
        });
      else res.json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error retrieving tema for forum id  ${req.params.forumID}.`,
      });
    });
};

exports.create = (req, res) => {
  // Save Tutorial in the database
  Tema.create(req.body)
    .then((data) => {
      console.log(data);
      res
        .status(201)
        .json({
          message: "Novo tema criado",
          location: `/foruns/${req.params.forumID}/temas/`,
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
};
