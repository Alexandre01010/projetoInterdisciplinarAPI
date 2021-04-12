// get resource model (definition and DB operations)
const TSIW = require('../models/tsiw.model.js');
exports.findAllUsers = (req, res) => {
    TSIW.getAllUsers((err, data) => {
        if (err) // send error response
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        else
            res.status(200).json(data); // send OK response with all tutorials data
    });
};

exports.delete = (req, res) => {
    TSIW.deleteUser(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res
            .status(404)
            .json({
              message: `Not found user with id ${req.params.id}`,
            });
        } else {
          res
            .status(500)
            .json({
              message: `Error retrieving user with id ${req.params.id}`,
            });
        }
      } else {
        res.status(200).json({
          message: `Deleted user with id ${req.params.id}`,
        });
      }
    });
  };