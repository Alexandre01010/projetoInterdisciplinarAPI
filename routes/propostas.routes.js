const express = require('express');
let router = express.Router();
const propostasController = require('../controllers/propostas.controller');
const { proposta } = require('../models/db');
// middleware for all routes related with tutorials
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/propostas')
    .get(propostasController.findAll)
    //.post(propostasController.findAll)

// //send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'Propostas: Not Found' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;