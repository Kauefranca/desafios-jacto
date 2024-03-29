const express = require('express');
const router = express.Router();

router.use('/api/cars', require('./api/cars/index'));

module.exports = router;