const db = require("../models/db.js");
const Foruns = db.forum;

const { Op } = require("sequelize")

exports.findAll = (req, res) => {
    //const title = req.query.title;
    //const { page, size, title } = req.query; //must comment line where getting just the title query parameter
    Foruns.findAll(req.body)
        .then(data => {
            
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving proposals",
            });
        });
};