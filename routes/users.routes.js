const express = require('express');
let router = express.Router();
const usersController = require('../controllers/users.controller.js');
const { user } = require('../models/db');
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
    .get(usersController.findAllUsers)
    .post(usersController.createUser)

    

router.all('*', function (req, res) {
    res.status(404).json({ message: 'Users: Not Found' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;