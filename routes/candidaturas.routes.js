const express = require('express');

const candidaturaController = require("../controllers/candidaturas.controller");


let router = express.Router({ mergeParams: true });


router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
   // .get(candidaturaController.getCandidaturas)
    .post(candidaturaController.createCandidatura)

router.route('/get')
    .get(candidaturaController.getCandidaturas)


// //send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'CANDIDATURAS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;