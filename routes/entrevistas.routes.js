const express = require('express');
let router = express.Router();
const entrevistasController = require("../controllers/entrevistas.controller.js");
const authController = require("../controllers/auth.controller")
const { route } = require('./candidaturas.routes.js');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

//--------------------Routes setup -------------------------------------
//base route for entrevistas
router.route('/')        
    .get(authController.verifyToken,entrevistasController.findEntrevistaFilterd)
    .post(authController.verifyToken,entrevistasController.createEntrevista);

//routes for an entrevista
router.route('/:idEntrevista')
    .put(authController.verifyToken,entrevistasController.updateEntrevista);


//routes for the participates entrevista:user
router.route('/:idEntrevista/participantes')
    .get(entrevistasController.findParticipantes);

router.route('/:idEntrevista/participantes/:idParticipante')
    .post(authController.verifyToken,entrevistasController.addParticipante) 
    .delete(authController.verifyToken,entrevistasController.deleteParticipante);


    
// //send a predefined error message for invalid routes on Entrevista
router.all('*', function (req, res) {
    res.status(404).json({ message: 'Entrevista: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;