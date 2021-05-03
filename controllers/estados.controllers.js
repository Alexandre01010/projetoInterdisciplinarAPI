
const db = require("../models/db.js");
const Entrevista = db.entrevista;
const Estado = db.estado;

// needed for LIKE operators
const { Op } = require('sequelize');





// Display list of all estados
exports.findAll =  (req, res) => {
    Entrevista.findByPk(req.params.idEntrevista, { include: Estado })
        
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Entrevista with id ${req.params.idEntrevista}.`
                });
            else
                res.status(200).json(data); 
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Estado for Entrevista with id ${req.params.idEntrevista}.`
            });
        });
};


//getting the estado from entrevista id
exports.findOneEstado = (req,res) =>{
    Entrevista.findByPk(req.params.idEntrevista, { include: Estado }) 
        .then(
            Estado.findByPk(req.params.estadoID)
                .then(data => {
                    if (data === null)
                        res.status(404).json({
                            message: `Not found Estado with id ${req.params.estadoID} from Entrevista ${req.params.idEntrevista}.`
                        });
                    else
                        res.status(200).json(data); 
                    })
                .catch(err => {
                    res.status(500).json({
                        message: `Error retrieving Estado with id ${req.params.estadoID} from Entrevista ${req.params.idEntrevista}.`
                    });
                })

        )
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Estado from Entrevista with id ${req.params.idEntrevista}.`
            });
        });
};