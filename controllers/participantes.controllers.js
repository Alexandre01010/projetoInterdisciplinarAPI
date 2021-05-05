const db = require("../models/db.js");
const Participantes = db.participante;

const { Op } = require("sequelize")


//-------------- For route => '/'  ---------------------------------

exports.findParticipantes = (req, res) => {        
    Participantes.findAll()
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `No Participantes where found at ${req}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving the Participantes."
            });
        });
};

/*exports.createEntrevista = (req, res) => {
    
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
    Entrevistas.findByPk(req.params.idEntrevista)
        .then(entrevista => {
            // no data returned means there is no tutorial in DB with that given ID 
            if (entrevista === null)
                res.status(404).json({
                    message: `Not found Entrevista with id ${req.params.idEntrevista}.`
                });
            else {
                Entrevistas.update(req.body, { where: { id: req.params.idEntrevista } })
                    .then(num => {
                        // check if one comment was updated (returns 0 if no data was updated)
                        if (num == 1) {
                            res.status(200).json({
                                message: `Entrevista id=${req.params.idEntrevista} was updated successfully.`
                            });
                        } else {
                            res.status(200).json({
                                message: `No updates were made on Entrevista id=${req.params.idEntrevista}.`
                            });
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error updating Entrevista with id=${req.params.idEntrevista}.`
            });
        });
}*/