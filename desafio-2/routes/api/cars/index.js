const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    res
    .status(200)
    .send(await req.app.get('DB')
        .query(`SELECT * FROM car;`)
    );
});

module.exports = router;