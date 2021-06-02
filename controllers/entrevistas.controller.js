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

    // testing if its reciving the data correctly
    const test_text = req.query.text;
    const cargo_req = req.query.cargo;
    //const logged_userID = 
    console.log("heres the text: "+ test_text)
    console.log("heres the cargo: " + cargo_req)

    
    const whitelist = ['text', 'cargo', 'id']; // we will set the id aside for later on the userlogged in
    let condition1 = {}
    let condition2 = {}
    
    Object.keys(req.query).forEach(function (key) {
        if (!whitelist.includes(key))
            return; //inform user of BAD REQUEST
            
        if (key == "text")
            condition1.texto_agenda = { [Op.like]: `%${req.query[key]}%` }
        if (key == "cargo")
            condition2.id_tipo_user = { [Op.like]: `%${req.query[key]}%` }
        
    });

    //notes on how to apply the last filter, the logged user
    // check the logged useds creations and participations
    // find the find all uses with that change, fill the condtions
    //for logged , entrevista.userid = loggedused || entrevista.participage = loggeduser
 


    // after the condition is built, apply said filter
    // {where:{texto_agenda: req.query.text},include:{model: user , where:{id_tipo_user: req.query.cargo}}}
    Entrevistas.findAndCountAll({where:condition1,include:{model: user ,where:condition2}})
        .then(data_text =>{
            if (data_text === null||data_text.count==0 ){
                res.status(404).json({
                    message: `No Entrevistas where found with the current condition: ${req.query.text} , ${req.query.cargo} .`
                });
            }
            else{
                console.log(data_text) // testing purpases
                res.json(data_text)

            }

        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving the Entrevistas."
            });
        });

        






    

    
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

