const express = require('express');
const router = express.Router();
const {
  insertRawLocation,
  processRawLocations,
  getRawLocations,
} = require('../controllers/rawLocationController');

router.post('/', insertRawLocation); // Endpoint para insertar ubicaciones sin procesar
//router.get('/', getRawLocations); // Endpoint para listar ubicaciones sin procesar
//router.post('/process-locations', processRawLocations); // Endpoint para procesar ubicaciones

module.exports = router;
