const db = require("../models/db.js");
const Entrevistas = db.entrevista;
const User = db.user;

const { Op } = require("sequelize");
const { user, entrevista } = require("../models/db.js");


//-------------- For route => '/'  ---------------------------------

exports.findAllEntrevista = (req, res) => {        
    Entrevistas.findAll()
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `No Entrevistas where found at ${req}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving the Entrevistas."
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
}

//---------------controlls for the entrevista:user (particiopantes from the entrevista)-----------------------

exports.findParticipantes = (req,res) => {

    Entrevistas.findByPk(req.params.idEntrevista,
        {
            include: {
                model: user,
                through: { attributes: [] } //remove data retrieved from join table
            }
        })
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Entrevista with id ${req.params.idEntrevistav}.`
                });
            else
                res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving User for Entrevista with id ${req.params.idEntrevista}.`
            });
        });

}

exports.addParticipante = (req,res) =>{

    Entrevistas.findByPk(req.params.idEntrevista)
        .then(entrevista => {
            // no data returned means there is no Entrevista in DB with that given ID 
            if (entrevista === null)
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.idEntrevista}.`
                });
            else {
                User.findByPk(req.params.idParticipante)
                    .then(user => {
                        // no data returned means there is no User in DB with that given ID 
                        if (user === null)
                            res.status(404).json({
                                message: `Not found User with id ${req.params.idParticipante}.`
                            });
                        else {
                            
                            user.addEntrevista(entrevista)
                                .then(data => {
                                    
                                    if (data === undefined)
                                        res.status(200).json({
                                            message: `User ${req.params.idParticipante} was already assigned to Entrevista ${req.params.idEntrevista}.`
                                        });
                                    else
                                        res.status(200).json({
                                            message: `Added User ${req.params.idParticipante} to Entrevista ${req.params.idEntrevista}.`
                                        });
                                })
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || `Error adding User ${req.params.idParticipante} to Entrevista ${req.params.idEntrevista}.`
            });
        });

}

exports.deleteParticipante = (req,res) =>{

    Entrevistas.findByPk(req.params.idEntrevista)
        .then(entrevista => {
            // no data returned means there is no Entrevista in DB with that given ID 
            if (entrevista === null)
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.idEntrevista}.`
                });
            else {
                User.findByPk(req.params.idParticipante)
                    .then(user => {
                        // no data returned means there is no user in DB with that given ID 
                        if (user === null)
                            res.status(404).json({
                                message: `Not found User with id ${req.params.idParticipante}.`
                            });
                        else {
                            
                            user.removeEntrevista(entrevista)
                                .then(data => {
                                    
                                    if (data === 1)
                                        res.status(200).json({
                                            message: `Removed User ${req.params.idParticipante} from Entrevista ${req.params.idEntrevista}.`
                                        });
                                    else
                                        res.status(200).json({
                                            message: `No User ${req.params.idParticipante} associated to Entrevista ${req.params.idEntrevista}.`
                                        });
                                })
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || `Error Removing User ${req.params.idParticipante} from Entrevista ${req.params.idEntrevista}.`
            });
        });

}

