const express = require('express');
const router = express.Router();
const { verifyOrCreateDevice } = require('../controllers/deviceController');

// Ruta para verificar o crear un dispositivo
router.post('/verify-or-create', verifyOrCreateDevice);

module.exports = router;
