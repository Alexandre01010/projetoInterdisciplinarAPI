const express = require('express');

const candidaturaController = require("../controllers/candidaturas.controller");

const authController = require("../controllers/auth.controller")


let router = express.Router({ mergeParams: true });


router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/:proposalID')
    .post(authController.verifyToken, authController.isStudent, candidaturaController.createCandidatura)

router.route('/')
    .get(candidaturaController.getCandidaturas)

router.route('/associadas')
    .get(candidaturaController.getByProposal)

// router.route('/:userID')
// .get(authController.verifyToken, authController.isAdminOrLoggedUser, userController.getUser);

router.route('/:userID')
    .get(candidaturaController.getOneCandidatura)
    .put(candidaturaController.updateCandidatura)
    .delete(authController.verifyToken, authController.isAdminOrLoggedUser, candidaturaController.deleteCandidatura)




// //send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'CANDIDATURAS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;