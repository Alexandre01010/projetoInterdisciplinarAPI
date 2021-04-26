const db = require("../models/db.js");
const Foruns = db.foruns;

const { Op } = require("sequelize")

exports.findAll = (req, res) => {
    //const title = req.query.title;
    //const { page, size, title } = req.query; //must comment line where getting just the title query parameter
    Foruns.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            // convert response data into custom format
           // const response = getPagingData(data, offset, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
  };