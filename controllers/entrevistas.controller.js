const db = require("../models/db.js");
const Entrevistas = db.entrevista;
const User = db.user;


const { Op, where } = require("sequelize");
const { user, entrevista } = require("../models/db.js");


//-------------- For route => '/'  ---------------------------------


// getting the entrevistas with filter setup
exports.findEntrevistaFilterd = (req,res) => {
    
    //Console logs for checking and confermation of recived query data
    const loggedUser = req.loggedUserId;    
    const test_text = req.query.text;
    const cargo_req = req.query.cargo;
    
    console.log("heres the text: "+ test_text)
    console.log("heres the cargo: " + cargo_req)
    console.log("heres the mockup loggedUserId: " + loggedUser)

    
    const whitelist = ['text', 'cargo', 'loggedUserId']; // whitelist of keys to fill the conditions
    let condition1 = {}// condition for entrevista texto
    let condition2 = {}// condition for cargo/creator of the entrevista
    let condition3 = {} // condition for the logged user
    
    // condtion to fill the conditions acording with the queries recived
    
    Object.keys(req.query).forEach(function (key) {
        if (!whitelist.includes(key))
            return; //inform user of BAD REQUEST
            
        if (key == "text")
            condition1.texto_agenda = { [Op.like]: `%${req.query[key]}%` }

        if (key == "cargo")
            condition2.id_tipo_user = { [Op.like]: `%${req.query[key]}%` }            
        

        if (key == "loggedUserId")          
            condition3.id_user = { [Op.like]: `%${req[key]}%` } 

        
    });
    

    // find and count all according to the queries recived in the conditions to search on the db 
    Entrevistas.findAndCountAll({where:condition1,include:[ 
        {model: User, as: 'creator' , where:condition2 },
        {model: User, through: { attributes: [] },where:condition3} // remove ALL data retrieved from join table       
    ]})
        .then(data =>{
            // if no entrevistas was not found, then return a 404 message , if not then it will respond with the data retrived
            if (data === null ||data.count==0)
                res.status(404).json({ message: `No Entrevistas where found with the current condition: ${req.query.text} , ${req.query.cargo}` });
            else
                res.status(200).json(data);
            
        })
        .catch (err =>{ 
            res.status(500).json({
                message: err.message || `Some error occurred while retrieving the Entrevistas..`
            });
        })



    
}


// adding/creating a new entrevista to the DB
exports.createEntrevista = (req, res) => {

    // validate request body data
    if (!req.body || !req.body.type) {
        res.status(400).json({ message: "Os dados não podem estar vazios!" });
        return;
    }
    // create a new entrevista acording with the data recived
    Entrevistas.create(req.body)
        .then(data => {
            res.status(201).json({ message: "Nova entrevista criada", location: "/entrevistas/" + data.id_agenda });
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

//----------------------------- For route => '/:idEntrevista'-----------------

// updating entrevista
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

// find the participantes of a specific entrevista
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

// adding a particcipant to the entrevista with :idEntrevista
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
// remove a participante from a specific entrevista
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

