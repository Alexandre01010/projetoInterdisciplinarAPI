const express = require('express');
let router = express.Router();
const propostasController = require('../controllers/propostas.controller.js');
const authController = require("../controllers/auth.controller")
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

router.route('/')
    //.get(propostasController.findPropostasFiltered)
    .post(authController.verifyToken, propostasController.create)
    .get(authController.verifyToken, propostasController.getMyPropostaFiltered)

router.route('/pending')
    .get(authController.verifyToken, authController.isAdmin, propostasController.ProposalForApproval)

router.route('/approved')
    .get(authController.verifyToken, propostasController.findApprovedProposals)

router.route('/:proposalID')
    .delete(authController.verifyToken, propostasController.deleteProposal)
    .get(propostasController.getOne)

//router.route('/candidaturas', require('./candidaturas.routes'))

router.use('/:proposalID/candidaturas', require('./candidaturas.routes'))
    
// //send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'Propostas: Not Found' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;