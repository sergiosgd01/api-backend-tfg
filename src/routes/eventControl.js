const express = require('express');
const { 
  getEventControl, 
  updateEventControl 
} = require('../controllers/eventControlController');

const router = express.Router();

router.get('/:eventCode', getEventControl); // Obtener el control de un evento
router.put('/:eventCode', updateEventControl); // Actualizar control de un evento

module.exports = router;
