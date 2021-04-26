const express = require('express');

const commentController = require("../controllers/comments.controller");


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
    .post(commentController.createComment)
    .get(commentController.findAll)

router.route('/:commentID')
    .get(commentController.getComment)

// //send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'COMMENTS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;