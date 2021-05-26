const db = require("../models/db.js");
const Entrevistas = db.entrevista;
const User = db.user;


const { Op, where } = require("sequelize");
const { user, entrevista } = require("../models/db.js");


//-------------- For route => '/'  ---------------------------------
//get all entrevistas for testing purpases
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


exports.findEntrevistaFilterd = (req,res) => {
    ///entrevistas?text=:searchText&cargo=:selectedCargo
    
    // text = :searchText -> text from the search bar
    // cargo = :selectedCargo -> the type of the user incharge of the interview , it has to be user types: 1 -docentes ,2 nao docentes ,3 alunos

    // try getting the first part of the fitler , the textfield
    const test_text = req.query.text;
    const cargo_req = req.query.cargo //must comment line where getting just the title query parameter
    console.log("heres the text: "+ test_text)
    console.log("heres the cargo: " + cargo_req)
    //for the most part the search will have to be changed, if we are looking for keywords in the description, then that need to be used diferently
    // for this you want to search the inter views and do a include users

    // apply both filters ( currently it isnt quite filtering, i tried putting in one find all count all but didnt work)
    if(req.query.text && req.query.cargo){
        Entrevistas.findAndCountAll({where:{texto_agenda: req.query.text}})
        .then(data_text =>{
            if (data_text === null||data_text.count==0 ){
                res.status(404).json({
                    message: `No Entrevistas where found with: ${req.query.text} .`
                });
            }
            else{
                
                Entrevistas.findAll({include:{model: user , where:{id_tipo_user: req.query.cargo}}})
                .then(data =>{
                    if (data === null||data.count==0 ){
                        res.status(404).json({
                            message: `No Entrevistas where found with cargo: ${req.query.cargo}.`
                        });
                    }
                    else(
                        res.json(data)
                    )
        
                })
                .catch(err => {
                    res.status(500).json({
                        message:
                            err.message || "Some error occurred while retrieving the Entrevistas."
                    });
                });

            }

        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving the Entrevistas."
            });
        });

    }


    // get entrevistas with text
    else if(req.query.text){
        Entrevistas.findAndCountAll({where:{texto_agenda: req.query.text}})
        .then(data =>{
            if (data === null||data.count==0 ){
                res.status(404).json({
                    message: `No Entrevistas where found with: ${req.query.text} .`
                });
            }
            else(
                res.json(data)
            )

        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving the Entrevistas."
            });
        });
    }   
    

    // Get entrevistas with cargo 
    else if(req.query.cargo){
        Entrevistas.findAndCountAll({include:{model: user , where:{id_tipo_user: req.query.cargo}}})
        .then(data =>{
            if (data === null||data.count==0 ){
                res.status(404).json({
                    message: `No Entrevistas where found with cargo: ${req.query.cargo}.`
                });
            }
            else(
                res.json(data)
            )

        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving the Entrevistas."
            });
        });

    }
    // if no filter is applied: default get
    else {
        Entrevistas.findAll()
            .then(data => {
                if (data === null)
                    res.status(404).json({
                        message: `No Entrevistas where found: user does not have entrevistas .`
                    });
                else{                    
                    res.json(data); 
                }
                    
            })
            .catch(err => {
                res.status(500).json({
                    message:
                        err.message || "Some error occurred while retrieving the Entrevistas."
                });
            });

    }

    
}



exports.createEntrevista = (req, res) => {
    if (!req.body || !req.body.type) {
        res.status(400).json({ message: "Os dados não podem estar vazios!" });
        return;
    }

    Entrevistas.create(req.body)
        .then(data => {
            res.status(201).json({ message: "Nova entrevista criada", location: "/entrevistas/" + req.body.id_agenda });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Ocorreu um erro ao criar uma entrevistas."
                });
        });
};

//----------------------------- For route => '/:idEntrevista'
exports.updateEntrevista = (req, res) => {
    // validate request body data
    if (!req.body || !req.body.type) {
        res.status(400).json({ message: "Os dados não podem estar vazios!" });
        return;
    }
    Entrevistas.findByPk(req.params.idEntrevista)
        .then(entrevista => {
            // no data returned means there is no tutorial in DB with that given ID 
            if (entrevista === null)
                res.status(404).json({
                    message: `Não foi encontrada uma entrevista com o id ${req.params.idEntrevista}.`
                });
            else {
                Entrevistas.update(req.body, { where: { id: req.params.idEntrevista } })
                    .then(num => {
                        // check if one comment was updated (returns 0 if no data was updated)
                        if (num == 1) {
                            res.status(200).json({
                                message: `Entrevista com id ${req.params.idEntrevista} foi alterada com sucesso.`
                            });
                        } else {
                            res.status(200).json({
                                message: `Não foi efetuado nenhuma alteração à entrevista ${req.params.idEntrevista}.`
                            });
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message:err.message || `Ocorreu um erro ao alterar a entrevista com o id ${req.params.idEntrevista}.`
            });
        });
}

//---------------controlls for the entrevista:user (particiopantes from the entrevista)-----------------------

exports.findParticipantes = (req, res) => {

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
                    message: `Não foi encontrada uma entrevista com o id ${req.params.idEntrevista}.`
                });
            else
                res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || `Ocorreu um erro ao obter o utilizador da entrevista com id ${req.params.idEntrevista}.`
            });
        });

}

exports.addParticipante = (req, res) => {

    Entrevistas.findByPk(req.params.idEntrevista)
        .then(entrevista => {
            // no data returned means there is no Entrevista in DB with that given ID 
            if (entrevista === null)
                res.status(404).json({
                    message: `Não foi encontrada uma entrevista com o id ${req.params.idEntrevista}.`
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

                            user.addEntrevista(entrevista)
                                .then(data => {

                                    if (data === undefined)
                                        res.status(200).json({
                                            message: `Utilizador ${req.params.idParticipante} já está associado a uma entrevista ${req.params.idEntrevista}.`
                                        });
                                    else
                                        res.status(200).json({
                                            message: `Adicionado o utilizador ${req.params.idParticipante} à entrevista ${req.params.idEntrevista}.`
                                        });
                                })
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || `Erro ao adicionar o utilizador ${req.params.idParticipante} à entrevista ${req.params.idEntrevista}.`
            });
        });

}

exports.deleteParticipante = (req, res) => {

    Entrevistas.findByPk(req.params.idEntrevista)
        .then(entrevista => {
            // no data returned means there is no Entrevista in DB with that given ID 
            if (entrevista === null)
                res.status(404).json({
                    message: `Não foi encontrada uma entrevista com o id ${req.params.idEntrevista}.`
                });
            else {
                User.findByPk(req.params.idParticipante)
                    .then(user => {
                        // no data returned means there is no user in DB with that given ID 
                        if (user === null)
                            res.status(404).json({
                                message: `Não foi encontrado o utilizador ${req.params.idParticipante}.`
                            });
                        else {

                            user.removeEntrevista(entrevista)
                                .then(data => {

                                    if (data === 1)
                                        res.status(200).json({
                                            message: `Removido o utilizador ${req.params.idParticipante} da entrevista ${req.params.idEntrevista}.`
                                        });
                                    else
                                        res.status(200).json({
                                            message: `Nenhum utilizador ${req.params.idParticipante} associada à entrevista ${req.params.idEntrevista}.`
                                        });
                                })
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || `Ocorreu um erro ao remover o utilizador ${req.params.idParticipante} da entrevista ${req.params.idEntrevista}.`
            });
        });

}

