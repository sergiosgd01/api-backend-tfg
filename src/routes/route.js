const express = require('express');
const {
  getRouteByEventCode,
  deleteRoute,
  createRoute,
  deleteRoutesByEventCode,
  updateVisitedStatus,
  updateVisitedStatusByEvent,
} = require('../controllers/routeController');

const router = express.Router();

router.get('/:code', getRouteByEventCode);

router.post('/', createRoute);

router.delete('/:id', deleteRoute);

router.delete('/event/:code', deleteRoutesByEventCode);

// Endpoint para actualizar un punto específico
router.patch('/:id', updateVisitedStatus);

// Endpoint para actualizar múltiples puntos basados en las ubicaciones del evento
router.post('/event/:code/update-visited', updateVisitedStatusByEvent);

module.exports = router;
