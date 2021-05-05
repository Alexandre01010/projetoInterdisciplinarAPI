const express = require('express');
const participanteController = require("../controllers/participantes.controllers.js");

// set 'mergeParams: true' on the router to access params from the parent router (like tutorialID req parameter)
let router = express.Router({mergeParams: true});



router.use((req, res, next) => {
    const start = Date.now();
    //compare a start time to an end time and figure out how many seconds elapsed
    res.on("finish", () => { // the finish event is emitted once the response has been sent to the client
        const end = Date.now();
        const diffSeconds = (Date.now() - start) / 1000;
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})


router.route('/')
    .get(participanteController.findParticipantes)
    //.post(participanteController.createParticipante)
/*router.route('/:idEntrevista/participantes/:idParticipante')
    .delete(participanteController.deleteParticipante)*/
    


router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'COMMENTS:  what???' });
})
module.exports = router;