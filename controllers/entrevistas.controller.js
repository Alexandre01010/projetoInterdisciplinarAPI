const db = require("../models/db.js");
const Entrevistas = db.entrevista;
const User = db.user;


const { Op, where } = require("sequelize");
const { user, entrevista } = require("../models/db.js");


//-------------- For route => '/'  ---------------------------------


// getting the entrevistas with filter setup
exports.findEntrevistaFilterd = (req,res) => {
    
    ///entrevistas?text=:searchText&cargo=:selectedCargo
    
    //for the user part, sence its reciving the user id from the loggedin user token header, we will do another type for testing purpases from postman
    
    const test_user = req.query.testlog; // this will be removed and also from the filter from postman

    // testing if its reciving the data correctly
    const test_text = req.query.text;
    const cargo_req = req.query.cargo;
    //const logged_userID = 
    console.log("heres the text: "+ test_text)
    console.log("heres the cargo: " + cargo_req)
    console.log("heres the mockup loggedUser: " + test_user)

    
    const whitelist = ['text', 'cargo', 'testlog']; // we will set the id aside for later on the userlogged in
    let condition1 = {}// condition for entrevista texto
    let condition2 = {}// condition for cargo/creator of the entrevista
    let condition3 = {} // condition for the logged user
    
    
    
    Object.keys(req.query).forEach(function (key) {
        if (!whitelist.includes(key))
            return; //inform user of BAD REQUEST
            
        if (key == "text")
            condition1.texto_agenda = { [Op.like]: `%${req.query[key]}%` }
        if (key == "cargo")
            condition2.id_tipo_user = { [Op.like]: `%${req.query[key]}%` }        
        

        if (key == "testlog")// the id will look like this probably req.loggedUserId
            //condition2.id_user = { [Op.like]: `%${req.query[key]}%` }
            condition3.id_user = { [Op.like]: `%${req.query[key]}%` } 

        
    });
    

    
    Entrevistas.findAndCountAll({where:condition1,include:[ 
        {model: User, as: 'creator' , where:condition2 },
        {model: User, through: { attributes: [] },where:condition3} // remove ALL data retrieved from join table       
    ]})
        .then(data =>{

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
    
    // somehow the id ends up null but it does put a new entrevista

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

