const db = require("../models/db.js");
const Entrevistas = db.entrevista;
const User = db.user;
const Role = db.role;

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

/*
exports.findEntrevistaFilterd = async(req,res) => {
    ///entrevistas?idUser=:loggedUser&text=:searchText&cargo=:selectedCargo
    // idUser = :loggedUser -> user logged in with associated interviews 
    // text = :searchText -> text from the search bar
    // cargo = :selectedCargo -> the type of the user incharge of the interview

    // steps to do the filter -> 
    //1 -search entrevista assosiated to the logged in user (check user id in the looged token info?)
    //2 - check if the text is blank or not, it cannot blanked
    //3 - check if the user inchage of the entrevista is the the type selected , canot be blacked
    //4 - res.json(data)


    // get and verify if the user is loggedin and get its id

    

    
        // after validations get the entrevistas then start to filter through parts
        Entrevistas.findAll()
            .then(entrevista => {
                if (entrevista === null)
                    res.status(404).json({
                        message: `No Entrevistas where found at ${req}.`
                    });
                else{
                    
                    User.findByPk(req.loggedUserId )
                        .then(user => {
                            // no data returned means there is no User in DB with that given ID 
                            if (user === null)
                                res.status(404).json({
                                    message: `Not found User with id ${req.loggedUserId}.`
                                });
                            else {
                                //checking the role of the user now acording ot the filter
                                Role.find

                            }
                        })
                    

                }
            })
            .catch(err => {
                res.status(500).json({
                    message:
                        err.message || "Some error occurred while retrieving the Entrevistas."
                });
            });

   

    try{
        // first check the the entrevistas the looged user is a participate in

        let loggedUser = await Entrevistas.findAll({
            where: {
                id_user : req.loggedUserId
            },
            include: {
                model: user,
                through: { attributes: [] } //remove data retrieved from join table
            }
        })

        if(loggedUser === null){
            res.status(404).json({
                message: `No Entrevistas where found with ${req.loggedUserId}.`
            })
        }

        // after that check of those entrevistas check if the user_id of the entrevista is acording to therole

        

        // after all that check the text if there are any keywords matching the the text_agenda
        //checking if its emphty
        if(req.params.searchText === null){
            res.status(404).json({
                message: `search text cant be empthy !!.`
            })
        }


        // finally return the results


        



        
    }
    catch{

        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving the Entrevistas."
        });
        
    }




        




}*/


exports.createEntrevista = (req, res) => {

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
                message: `Ocorreu um erro ao alterar a entrevista com o id ${req.params.idEntrevista}.`
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
                message: `Ocorreu um erro ao obter o utilizador da entrevista com id ${req.params.idEntrevista}.`
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

