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