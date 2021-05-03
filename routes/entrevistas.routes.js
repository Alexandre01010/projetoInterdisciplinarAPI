const express = require('express');
let router = express.Router();
const entrevistasController = require("../controllers/entrevista.controller.js");

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(entrevistasController.findAllEntrevista)
    .post(entrevistasController.createEntrevista)
router.route('/:idEntrevista')
    .put(entrevistasController.updateEntrevista)

//participants part WIP   
/*router.route('/:idEntrevista/participantes')
    .get(entrevistasController.findParticipantes)
    .post(entrevistasController.createParticipante)
router.route('/:idEntrevista/participantes/:idParticipante')
    .delete(entrevistasController.deleteParticipante)
*/
    
// //send a predefined error message for invalid routes on Entrevista
router.all('*', function (req, res) {
    res.status(404).json({ message: 'Entrevista: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;