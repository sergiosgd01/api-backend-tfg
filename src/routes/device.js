const express = require('express');
const router = express.Router();
const { verifyDevice, createDevice, getDevicesByEventCode } = require('../controllers/deviceController');

// Ruta para verificar si un dispositivo existe
router.get('/verify', verifyDevice);

// Ruta para crear un dispositivo
router.post('/create', createDevice);

// Ruta para obtener todos los dispositivos por eventCode
router.get('/devices-by-event/:eventCode', getDevicesByEventCode);

module.exports = router;
