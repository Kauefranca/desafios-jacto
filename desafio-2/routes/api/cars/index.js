const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    res.status(200).send('OK');
});

module.exports = router;