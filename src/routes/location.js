const express = require('express');
const { 
  getLocationByEventCode, 
  getLocationsByEventCodeDeviceID,
  insertLocation, 
  deleteLocation, 
  deleteLocationsByDeviceAndEvent 
} = require('../controllers/locationController');
const router = express.Router();

router.get('/device', getLocationsByEventCodeDeviceID);
router.get('/:code', getLocationByEventCode);

router.post('/', insertLocation);

router.delete('/:id', deleteLocation);
router.delete('/event/:eventCode/device/:deviceID', deleteLocationsByDeviceAndEvent); 

module.exports = router;
