const db = require("../models/db.js");
const Entrevistas = db.entrevista;

const { Op } = require("sequelize")


//-------------- For route => '/'  ---------------------------------
exports.findAllEntrevista = (req, res) => {
    
    Foruns.findAllEntrevista(req.body)
        .then(data => {
            
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving entrevistas",
            });
        });
};
exports.createEntrevista = (req, res) => {
    
    Entrevistas.create(req.body)
      .then(data => {
        res.status(201).json({ message: "Nova entrevista criada", location: "/entrevistas/" + data.id_entrevista });
      })
      .catch(err => {
        if (err.name === 'SequelizeValidationError')
          res.status(400).json({ message: err.errors[0].message });
        else
          res.status(500).json({
            message: err.message || "Some error occurred while creating the entrevista."
          });
      });
  };

//----------------------------- For route => '/:idEntrevista'
exports.updateEntrevista = (req,res) => {
    // validate request body data
    if (!req.body || !req.body.type) {
        res.status(400).json({ message: "Request body can not be empty!" });
        return;
    }
    Entrevistas.findByPk(req.params.id)
        .then(entrevista => {
            // no data returned means there is no tutorial in DB with that given ID 
            if (entrevista === null)
                res.status(404).json({
                    message: `Not found Entrevista with id ${req.params.id}.`
                });
            else {
                Entrevistas.update(req.body, { where: { id: req.params.id } })
                    .then(num => {
                        // check if one comment was updated (returns 0 if no data was updated)
                        if (num == 1) {
                            res.status(200).json({
                                message: `Entrevista id=${req.params.id} was updated successfully.`
                            });
                        } else {
                            res.status(200).json({
                                message: `No updates were made on Entrevista id=${req.params.id}.`
                            });
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error updating Entrevista with id=${req.params.id}.`
            });
        });
}