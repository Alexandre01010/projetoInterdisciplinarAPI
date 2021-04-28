const db = require("../models/db.js");
const Foruns = db.forum;

const { Op } = require("sequelize")


exports.findByUser=(req,res)=>{
  Foruns.findByUser(req.params.userID)
  .then(data => {
    if (data === null)
      res.status(404).json({
        message: `Not found forum for user id  ${req.params.userID}.`
      });
    else
      res.json(data);
  })
  .catch(err => {
    res.status(500).json({
      message: `Error retrieving forums for user id  ${req.params.userID}.`
    });
  });
}

exports.findAll = (req, res) => {
    //const title = req.query.title;
    //const { page, size, title } = req.query; //must comment line where getting just the title query parameter
    Foruns.findAll(req.body)
        .then(data => {
            
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving foruns",
            });
        });
};
exports.create = (req, res) => {
    // Save Tutorial in the database
    Foruns.create(req.body)
      .then(data => {
        res.status(201).json({ message: "Novo forum criado", location: "/foruns/" + data.id_forum });
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