const express = require('express');
const router = express.Router();

router.use('/api/cars', require('./api/cars/index'));

router.get('/', (req, res) => {
    res.status(200).send();
});

module.exports = router;