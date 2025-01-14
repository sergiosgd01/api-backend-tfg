const express = require('express');
const {
  getRouteByEventCode,
  deleteRoute,
  createRoute,
  deleteRoutesByEventCode,
  updateVisitedStatus,
  resetVisitedStatusByEventCode,
} = require('../controllers/routeController');

const router = express.Router();

router.get('/:code', getRouteByEventCode);

router.post('/', createRoute);

router.delete('/:id', deleteRoute);

router.delete('/event/:code', deleteRoutesByEventCode);

router.patch('/update-visited', updateVisitedStatus);

router.patch('/reset-visited/:code', resetVisitedStatusByEventCode);

module.exports = router;
