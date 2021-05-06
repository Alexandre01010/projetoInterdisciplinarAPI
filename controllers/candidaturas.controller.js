const db = require("../models/db.js");
const Candidaturas = db.candidatura;
const Proposta = db.proposta;
const User = db.user;

exports.getCandidaturas = (req, res) => {
  Candidaturas.findAll(req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving proposals",
      });
    });
}

exports.createCandidatura = (req, res) => {
  Proposta.findByPk(req.params.proposalID)
  .then(prop => {
    if(prop === null){
      res.status(404).json({
        message: "Não foi encontrado uma porposta com id " + req.params.proposalID + "."
      })
    }else{
      Candidaturas.create({
        id_user: req.body.id_user, id_proposta: req.params.proposalID, mensagem: req.body.mensagem,
        id_tipo_estado: req.body.id_tipo_estado, n_ordem_escolha: req.body.n_ordem_escolha
      })
      .then ((data) => {
        res.status(201).json({
          message: "Candidatura criada com sucesso na proposta com id " + req.params.proposalID + "."
        })
      })
      .catch((err) => {
        if(err.name === "SequelizeValidationError"){
          res.status(400).json({ message: err.errors[0].message})
        }else{
          res.status(500).json({
            message:
            err.message || "Some error occurred while creating the Tutorial.",
          })
        }
      })
    }
  }) 
}

// exports.createCandidatura = (req, res) => {
//   Proposta.findByPk(req.params.proposalID)
//   .then(prop => {
//     if(prop === null){
//       res.status(404).json({
//         message: "Não foi encontrado uma porposta com id " + req.params.proposalID + "." 
//       })
//     }else{
//       User.findByPk(req.body.id_user)
//       .then(user => {
//         if(user === null){
//           res.status(404).json({
//             message: "Não foi encontrado nenhum user com id " + req.body.id_user + "."
//           })
//         }else{
//           Candidaturas.create({
//             id_user: req.body.id_user, id_proposta: req.params.proposalID, mensagem: req.body.mensagem,
//             id_tipo_estado: req.body.id_tipo_estado, n_ordem_escolha: req.body.n_ordem_escolha
//           })
//           .then((data) => {
//             res.status(201).json({
//               message: "Candidatura criada com sucesso na proposta com id " + req.params.proposalID + "."
//             })
//           })
//           .catch((err) => {
//             if(err.name === "SequelizeValidationError"){
//               res.status(400).json({ message: err.errors[0].message })
//             }else{
//               res.status(500).json({
//                 message:
//                 err.message || "Some error occurred while creating the Tutorial.",
//               })
//             }
//           })
//         }
//       })
//     }
//   })
// }

exports.createCandidatura = async (req, res) =>{
  try{
    let pedidoProposta = await Proposta.findByPk(req.params.proposalID)
    if(pedidoProposta === null){
      res.status(404).json({
        message: "Not found proposal with id " + req.params.proposalID
      })
      return
    }
    req.body.id_proposta = req.params.proposalID 
    console.log(req.body)
    let cand = await Candidaturas.create(req.body)
    //await Proposta.addCandidaturas(cand)

    res.status(201).json({ message: "Candidatura criada"})

  }catch(err){
    res.status(500).json({
      message: err || "Error creating candidatura on proposal with id " + req.params.proposalID
    })
  }

}

exports.getOneCandidatura = (req, res) => {
  Candidaturas.findAll({ where: { id_proposta: req.params.proposalID, id_user: req.params.userID } })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving tutorials",
      });
    });
};
