const db = require("../models/db.js");
const Comment = db.comment;
const Tutorial = db.tutorial;
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

exports.getComment = (req, res) => {
    // obtains only a single entry from the table, using the provided primary key
    Comment.findByPk(req.params.commentID)
      .then(data => {
        if (data === null)
          res.status(404).json({
            message: `Not found Comment with id ${req.params.commentID}.`
          });
        else
          res.json(data);
      })
      .catch(err => {
        res.status(500).json({
          message: `Error retrieving Comment with id ${req.params.commentID}.`
        });
      });
  };

  exports.findAll =  (req, res) => {
    Tutorial.findByPk(req.params.tutorialID, { include: Comment })
        .then(data => {
            if (data === null)
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                });
            else
                res.status(200).json(data); 
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving Comments for Tutorial with id ${req.params.tutorialID}.`
            });
        });
};
