const db = require("../models/db.js");
const Proposta = db.proposta;

const { Op } = require("sequelize")
// Display list of all tutorials

// const getPagination = (page, size) => {
//     const limit = size ? size : 3; // limit = size (default is 3)
//     const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
//     return { limit, offset };
//   };
  
  exports.findAll = (req, res) => {
    //const title = req.query.title;
    const { page, size, title } = req.query; //must comment line where getting just the title query parameter
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    Proposta.findAndCountAll({ where: condition, limit, offset })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          message:
            err.message || "Ocorreu um erro ao tentar buscar as propostas",
        });
      });
  };
  
//   // Handle tutorial creation on POST
//   exports.create = (req, res) => {
//     // Save Tutorial in the database (IF request body data is validated by Sequelize
//     Tutorial.create(req.body)
//       .then((data) => {
//         res.status(201).json({
//           message: "New tutorial created.",
//           location: "/tutorials/" + data.id,
//         });
//       })
//       .catch((err) => {
//         // Tutorial model as validation for the title column (not null)
//         if (err.name === "SequelizeValidationError")
//           res.status(400).json({ message: err.errors[0].message });
//         else
//           res.status(500).json({
//             message:
//               err.message || "Some error occurred while creating the Tutorial.",
//           });
//       });
  
//     // // Validate request
//     // if (!req.body || !req.body.title) {
//     //     res.status(400).json({ message: "Title can not be empty!" });
//     //     return;
//     // }
  
//     // // Create a Tutorial object
//     // const tutorial = {
//     //     title: req.body.title,
//     //     description: req.body.description,
//     //     published: req.body.published ? req.body.published : false
//     // };
  
//     // // Save Tutorial in the database
//     // Tutorial.create(tutorial, (err, data) => {
//     //     if (err)
//     //         res.status(500).json({
//     //             message: err.message || "Some error occurred while creating the Tutorial."
//     //         });
//     //     else{
//     //         // all is OK, send new tutorial ID in the response
//     //         res.status(201).json({ message: "New tutorial created.", location: "/tutorials/" + data.insertId });
//     //     }
  
//     // });
//   };
  
//   // List just one tutorial
//   exports.findOne = (req, res) => {
//     // obtains only a single entry from the table, using the provided primary key
//     Tutorial.findByPk(req.params.tutorialID)
//       .then(data => {
//         if (data === null)
//           res.status(404).json({
//             message: `Not found Tutorial with id ${req.params.tutorialID}.`
//           });
//         else
//           res.json(data);
//       })
//       .catch(err => {
//         res.status(500).json({
//           message: `Error retrieving Tutorial with id ${req.params.tutorialID}.`
//         });
//       });
//   };
  
//   exports.update = (req, res) => {
//     Tutorial.update(req.body, { where: { id: req.params.tutorialID } })
//       .then(num => {
//         // console.log(num)
//         if (num == 1) {
//           res.json({
//             message: `Tutorial with id=${req.params.tutorialID} was updated successfully.`
//           });
//         } else {
//           res.status(404).json({
//             message: `Not found Tutorial with id=${req.params.tutorialID}.`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).json({
//           message: `Error updating Tutorial with id=${req.params.id}.`
//         });
//       });
//   };
  
//   exports.delete = (req, res) => {
//     Tutorial.destroy({ where: { id: req.params.tutorialID } })
//       .then(num => {
//         if (num == 1) {
//           res.status(200).json({
//             message: `Tutorial with id ${req.params.tutorialID} was successfully deleted!`
//           });
//         } else {
//           res.status(404).json({
//             message: `Not found Tutorial with id=${req.params.tutorialID}.`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).json({
//           message: `Error deleting Tutorial with id=${req.params.tutorialID}.`
//         });
//       });
//   };
  
//   // Display list of all published tutorials
//   exports.findAllPublished = (req, res) => {
//     Tutorial.findAll({ where: { published: true } })
//       .then((data) => {
//         res.status(200).json(data);
//       })
//       .catch((err) => {
//         res.status(500).json({
//           message:
//             err.message || "Some error occurred while retrieving tutorials",
//         });
//       });
//   };