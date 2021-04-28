const db = require("../models/db.js");
const Candidatura = db.candidatura;
const Proposta = db.proposta;

exports.getCandidaturas = (req, res) => {
    Candidatura.findAll(req.body)
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
    // Save Tutorial in the database (IF request body data is validated by Sequelize
    Candidatura.create(req.body)
      .then((data) => {
        res.status(201).json({
          message: "New candidatura created.",
          location: "/candidatura/" + data.id,
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

