const express = require('express');
const {
  getRouteByEventCode,
  getRouteByEventCodeDeviceID,
  deleteRoutePoint,
  createRoutePoint,
  deleteAllRoutes,
  updateVisitedStatus,
  resetVisitedStatusByEventCode,
} = require('../controllers/routeController');

const router = express.Router();

router.get('/device', getRouteByEventCodeDeviceID);
router.get('/:code', getRouteByEventCode);

router.post('/', createRoutePoint);

router.delete('/:id', deleteRoutePoint);
router.delete('/deleteAll', deleteAllRoutes); 

router.patch('/update-visited', updateVisitedStatus);
router.patch('/reset-visited/:code', resetVisitedStatusByEventCode);

module.exports = router;