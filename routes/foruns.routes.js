const express = require('express');
let router = express.Router();
const forunsController = require("../controllers/foruns.controller.js");
const authController = require("../controllers/auth.controller")
const temasController = require("../controllers/temas.controller.js");
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/temas/:temaID/respostas')
    .get(temasController.findRespostas)
    //.put(temasController.update)
    //.delete(temasController.delete)

router.route('/temas/:temaID')
    .get(temasController.findByID)
    .put(temasController.update)
    .delete(temasController.delete)


router.route('/:forumID/temas')
    .get(temasController.findByForum)
    .post(temasController.create)

//conlcuir quando houver users
router.route('/:userID')
    .get(forunsController.findByUser)
router.route('/')
    .get(authController.verifyToken, forunsController.findAll)
    .post(authController.verifyToken, forunsController.create)

router.route('/:forumID/participantes/:idParticipante')
    .post(authController.verifyToken, forunsController.addParticipante)

// //send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'COMMENTS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;