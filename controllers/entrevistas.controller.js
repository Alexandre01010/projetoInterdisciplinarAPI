const db = require("../models/db.js");
const Entrevistas = db.entrevista;
const User = db.user;
const Participantes = db.participante

//const {Op} = require('sequelize')

const {Op, where} = require('sequelize')

//const { Op, where } = require("sequelize");
const { user, entrevista } = require("../models/db.js");


//-------------- For route => '/'  ---------------------------------


// getting the entrevistas with filter setup
// exports.findEntrevistaFilterd = (req,res) => {

//     //Console logs for checking and confermation of recived query data
//     const loggedUser = req.loggedUserId;    
//     const test_text = req.query.text;
//     const cargo_req = req.query.cargo;

//     console.log("heres the text: "+ test_text)
//     console.log("heres the cargo: " + cargo_req)
//     console.log("heres the mockup loggedUserId: " + loggedUser)


//     const whitelist = ['text', 'cargo']; // whitelist of keys to fill the conditions
//     let condition1 = {}// condition for entrevista texto
//     let condition2 = {}// condition for cargo/creator of the entrevista
//     let condition3 = {} // condition for the logged user

//     // condtion to fill the conditions acording with the queries recived

//     Object.keys(req.query).forEach(function (key) {
//         if (!whitelist.includes(key))
//             return; //inform user of BAD REQUEST

//         if (key == "text")
//             condition1.texto_agenda = { [Op.like]: `%${req.query[key]}%` }

//         if (key == "cargo")
//             condition2.id_tipo_user = { [Op.like]: `%${req.query[key]}%` }            


//     });

//     // condtion for condtion3 in order to get entrevistas where the loggeduser is participating              
//     condition3.id_user = { [Op.like]: `%${req.loggedUserId}%` } 


//     // find and count all according to the queries recived in the conditions to search on the db 
//     Entrevistas.findAndCountAll({where:condition1,include:[ 
//         {model: User, as: 'creator' , where:condition2 },
//         {model: User, through: { attributes: [] },where:condition3} // remove ALL data retrieved from join table       
//     ]})
//         .then(data =>{
//             // if no entrevistas was not found, then return a 404 message , if not then it will respond with the data retrived
//             if (data === null ||data.count==0)
//                 res.status(404).json({ message: `No Entrevistas where found with the current condition: ${req.query.text} , ${req.query.cargo}` });
//             else
//                 res.status(200).json(data);

//         })
//         .catch (err =>{ 
//             res.status(500).json({
//                 message: err.message || `Some error occurred while retrieving the Entrevistas..`
//             });
//         })




// }

// exports.findEntrevistaFilterd = (req, res) => {
//     let entrevistas
//     Entrevistas.findAll({ where: { id_user: req.loggedUserId } })
//     .then((data) => {
//         if(data.length > 0){
//             entrevistas = data
//         }
//         Participantes.findAll( { where: { id_user: req.loggedUserId }} )
//         .then((prop) => {
//             if(prop.length > 0){
//                 prop.forEach(element => {
//                     console.log("prop " + prop.dataValues[0])
//                     Entrevistas.findOne({ where: { id_agenda: prop.dataValues.id_agenda } })
//                     .then((entr) => {
//                         entrevistas.push(entre)
//                     })
//                 });
//             }
//         })

//         res.status(200).json(entrevistas)
//     })
// }

exports.findEntrevistaFilterd = (req, res) => {
    let entrevistas = []
    if(req.query.texto){
        Participantes.findAll({ where: { id_user: req.loggedUserId } })
        .then((data) => {
            if(data.length != 0){
                for(let i = 0 ; i < data.length; i++){
                    entrevistas.push(data[i].id_agenda)
                }
            }
            Entrevistas.findAll( { where: { [Op.and]:[{texto_agenda: {[Op.like]: `%${req.query.texto}%` }}, { [Op.or]: [{ id_agenda: { [Op.in]:entrevistas } }, { id_user: req.loggedUserId }] }] } })
            .then((prop) => {
                if(prop.length != 0 ){
                    res.status(200).json(prop)
                }else{
                    res.status(404).json({
                        message: "Não há entrevistas associadas"                    
                    })
                }
            })
            .catch((err)=> {
                res.status(500).json({
                    message:
                      err.message || "Ocorreu um erro ao encontrar candidaturas",
                  });
            })
        })
    }else{
        Participantes.findAll({ where: { id_user: req.loggedUserId } })
        .then((data) => {
            if(data.length != 0){
                for(let i = 0 ; i < data.length; i++){
                    entrevistas.push(data[i].id_agenda)
    
                }
            }
            Entrevistas.findAll( { where: { [Op.or]: [{ id_agenda: { [Op.in]:entrevistas } }, { id_user: req.loggedUserId }] } })
            .then((prop) => {
                if(prop.length != 0 ){
                    res.status(200).json(prop)
                }else{
                    res.status(404).json({
                        message: "Não há entrevistas associadas"
                    })
                }
            })
            .catch((err)=> {
                res.status(500).json({
                    message:
                      err.message || "Ocorreu um erro ao encontrar candidaturas",
                  });
            })
        })
    }
}

// exports.findEntrevistaFilterd = (req, res) => {
//     if (req.query.text) {
//       const whitelist = ['text'];
//       let condition = { id_user: req.loggedUserId };
//       Object.keys(req.query).forEach(function (key) {
//         if (!whitelist.includes(key))
//           return; //inform user of BAD REQUEST           
//         if (key == "text")
//           condition.texto_agenda = { [Op.like]: `%${req.query[key]}%` }
//       });
//       Proposta.findAll({
//         where: condition
//       })
//         .then(data => {
//           res.status(200).json(data);
//         })
//         .catch(err => {
//           res.status(500).json({
//             message:
//               err.message || "Ocorreu um erro ao encontrar propostas"
//           });
//         });
//     }
//     else {
//       Proposta.findAll({ where: { id_tipo_estado: 3 } })
//         .then(data => {
//           res.status(200).json(data);
//         })
//         .catch((err) => {
//           res.status(500).json({
//             message:
//               err.message || "Ocorreu um erro ao encontrar propostas",
//           });
//         });
//     }
//   }


// adding/creating a new entrevista to the DB
exports.createEntrevista = (req, res) => {

    // create a new entrevista acording with the data recived
    Entrevistas.create({ id_user: req.body.id_user, data_hora: req.body.data_hora, id_tipo_estado: req.body.id_tipo_estado, texto_agenda: req.body.texto_agenda })
        .then(data => {
            // so data.null is gonna be the new assined id_agenda, acording to console.log(data) id_agenda: null and because its null it will a sign a new id value

            res.status(201).json({ message: "Nova entrevista criada", location: "/entrevistas/" + data.null });

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
                message: err.message || `Ocorreu um erro ao alterar a entrevista com o id ${req.params.idEntrevista}.`
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



