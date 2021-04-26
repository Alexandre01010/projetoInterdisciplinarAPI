const db = require("../models/db.js");
const Candidatura = db.comment;
const Tutorial = db.tutorial;

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

