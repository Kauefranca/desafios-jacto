const express = require('express');
const router = express.Router();

// Esse arquivo é apenas para deixar todos os arquivos
// da pasta /api/cars disponíveis na url também como /api/cars
router.use('/api/cars', require('./api/cars/index'));

module.exports = router;