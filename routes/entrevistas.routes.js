const express = require('express');
let router = express.Router();
const entrevistasController = require("../controllers/entrevistas.controller.js");
const { route } = require('./candidaturas.routes.js');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')    
    //.get(entrevistasController.findAllEntrevista) //for text purpaces
    .get(entrevistasController.findEntrevistaFilterd)
    .post(entrevistasController.createEntrevista)
router.route('/:idEntrevista')
    .put(entrevistasController.updateEntrevista)


//routes for the participates entrevista:user
router.route('/:idEntrevista/participantes')
    .get(entrevistasController.findParticipantes)
router.route('/:idEntrevista/participantes/:idParticipante')
    .post(entrevistasController.addParticipante) 
    .delete(entrevistasController.deleteParticipante)
/*    
router.route('/entrevistas?text=:searchText&cargo=:selectedCargo')
    .get(entrevistasController.findEntrevistaFilterd) */




    
// //send a predefined error message for invalid routes on Entrevista
router.all('*', function (req, res) {
    res.status(404).json({ message: 'Entrevista: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;