const db = require("../models/db.js");
const Candidatura = db.candidatura;
const Proposta = db.proposta;

// exports.getComment = (req, res) => {
//     Comment.findByPK(req.params.commentID)
//       .then((data) => {
//         res.status(200).json(data);
//       })
//       .catch((err) => {
//         res.status(500).json({
//           message:
//             err.message || "Some error occurred while retrieving comments",
//         });
//       });
//   };

exports.createComment = (req, res) => {
    // Save Comment in the database
    Comment.create({
        author: req.body.author, text: req.body.text, tutorialId:
            req.params.tutorialID
    })
        .then(data => {
            res.status(201).json({
                message: "New Comment created.", location: "/tutorials/" +
                    req.params.tutorialID + "/comments/" + data.id
            });
            
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the Comment."
                });
        });
};

