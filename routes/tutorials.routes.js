const express = require('express');
let router = express.Router();
const tutorialController = require('../controllers/tutorials.controller');
const { tutorial } = require('../models/db');
// middleware for all routes related with tutorials
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})
router.get('/', tutorialController.findAll);
router.get('/published', tutorialController.findAllPublished)
router.get('/comented',tutorialController.findAllComented)
router.get('')
router.get('/:tutorialID', tutorialController.findOne);
router.put('/:tutorialID', tutorialController.update)
router.delete('/:tutorialID', tutorialController.delete);
router.get('/published', tutorialController.findAllPublished)
router.post('/', tutorialController.create)

router.use('/:tutorialID/comments', require('./comments.routes'))
router.use('/:tutorialID/comments/:commentID', require('./comments.routes'))

// //send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'TUTORIALS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;