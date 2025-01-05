const express = require('express');
const router = express.Router();
const {
  insertRawLocation,
  getRawLocationsByEventCode,
  deleteRawLocationsByEventCode,
} = require('../controllers/rawLocationController');

// Inserta una nueva ubicación sin procesar
router.post('/', insertRawLocation);

// Recupera ubicaciones por código de evento
router.get('/:code', getRawLocationsByEventCode);

router.delete('/:code', deleteRawLocationsByEventCode);

module.exports = router;
