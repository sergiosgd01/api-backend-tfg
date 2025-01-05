const express = require('express');
const router = express.Router();
const {
  insertRawLocation,
  getRawLocationsByEventCode,
} = require('../controllers/rawLocationController');

// Inserta una nueva ubicación sin procesar
router.post('/', insertRawLocation);

// Recupera ubicaciones por código de evento
router.get('/:code', getRawLocationsByEventCode);

module.exports = router;
