const express = require('express');
const { 
  getLocation, 
  getLocationsByDeviceId,
  insertLocation, 
  deleteLocation, 
  deleteLocationsByDeviceAndEvent 
} = require('../controllers/locationController');
const router = express.Router();

router.get('/device', getLocationsByDeviceId);
router.get('/:code', getLocation);

router.post('/', insertLocation);

router.delete('/:id', deleteLocation);
router.delete('/event/:eventCode/device/:deviceID', deleteLocationsByDeviceAndEvent); 

module.exports = router;
