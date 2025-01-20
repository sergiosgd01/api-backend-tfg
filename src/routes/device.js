const express = require('express');
const router = express.Router();
const {
  verifyDevice,
  createDevice,
  getDevicesByEventCode,
  getDevicesByDeviceID,
  editDevice,
} = require('../controllers/deviceController');

// Ruta para verificar si un dispositivo existe
router.get('/verify', verifyDevice);

// Ruta para crear un dispositivo
router.post('/create', createDevice);

// Ruta para obtener todos los dispositivos por eventCode
router.get('/devices-by-event/:eventCode', getDevicesByEventCode);

// Ruta para obtener todos los dispositivos por deviceID
router.get('/devices-by-id/:deviceID', getDevicesByDeviceID);

// Ruta para editar un dispositivo
router.put('/edit/:deviceID/:eventCode', editDevice);

module.exports = router;
