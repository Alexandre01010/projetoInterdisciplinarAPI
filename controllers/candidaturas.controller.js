const db = require("../models/db.js");
const Candidaturas = db.candidatura;
const Proposta = db.proposta;

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


//   exports.getCandidaturas =  (req, res) => {
//     Candidaturas.findByPk(req.params.proposalID,  { include: Proposta })
//         .then(data => {
//             if (data === null)
//                 res.status(404).json({
//                     message: `Not found Proposal with id ${req.params.proposalID}.`
//                 });
//             else
//                 res.status(200).json(data); 
//         })
//         .catch(err => {
//             res.status(500).json({
//                 message: `Error retrieving candidaturas for Proposal with id ${req.params.proposalID}.`
//             });
//         });
// };

  exports.createCandidatura = (req, res) => {
    // Save Tutorial in the database (IF request body data is validated by Sequelize
    Candidaturas.create({
      id_user: req.body.id_user, id_proposta: req.params.proposalID, mensagem: req.body.mensagem, 
      id_tipo_estado: req.body.id_tipo_estado, n_ordem_escolha: req.body.n_ordem_escolha 
    })
      .then((data) => {
        res.status(201).json({
          message: "New candidatura created."
        });
      })
      .catch((err) => {
        // Tutorial model as validation for the title column (not null)
        if (err.name === "SequelizeValidationError")
          res.status(400).json({ message: err.errors[0].message });
        else
          res.status(500).json({
            message:
              err.message || "Some error occurred while creating the Tutorial.",
          });
      });
  };

