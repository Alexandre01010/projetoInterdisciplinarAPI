const express = require('express');

const candidaturaController = require("../controllers/candidaturas.controller");

const authController = require("../controllers/auth.controller")


let router = express.Router({ mergeParams: true });


router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/:proposalID')
    .post(authController.verifyToken, authController.isOnlyStudent, candidaturaController.createCandidatura)

router.route('/')
    .get(authController.verifyToken, authController.isAdmin, candidaturaController.getCandidaturas)

router.route('/associadas')
    .get(candidaturaController.getByProposal)

router.route('/minhas')
    .get(authController.verifyToken, authController.isOnlyStudent, candidaturaController.getMyCandidaturas )

    // router.route('/:userID')
    // .get(authController.verifyToken, authController.isAdminOrLoggedUser, userController.getUser);

router.route('/:userID')
    .get(candidaturaController.getOneCandidatura)
    .put(candidaturaController.updateCandidatura)
    .delete(authController.verifyToken, authController.isAdminOrLoggedUser,  candidaturaController.deleteCandidatura)

   


// //send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'CANDIDATURAS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;