const express = require('express');
const {
  getRouteByEventCode,
  getRouteByEventCodeDeviceID,
  deleteRoutePoint,
  createRoutePoint,
  deleteRoutesByEventCodeDeviceID,
  updateVisitedStatus,
  resetVisitedStatusByEventCode,
} = require('../controllers/routeController');

const router = express.Router();

router.get('/device', getRouteByEventCodeDeviceID);

router.get('/:code', getRouteByEventCode);

router.post('/', createRoutePoint);

router.delete('/:id', deleteRoutePoint);

router.delete('/event/:code/device/:deviceId', deleteRoutesByEventCodeDeviceID);

router.patch('/update-visited', updateVisitedStatus);

router.patch('/reset-visited/:code', resetVisitedStatusByEventCode);

module.exports = router;