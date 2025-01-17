const express = require('express');
const { 
  getLocation, 
  getLocationsByDeviceId,
  insertLocation, 
  deleteLocation, 
  deleteLocationsByEventCode 
} = require('../controllers/locationController');
const router = express.Router();

router.get('/device', getLocationsByDeviceId);
router.get('/:code', getLocation);

router.post('/', insertLocation);

router.delete('/:id', deleteLocation);
router.delete('/event/:code', deleteLocationsByEventCode);

module.exports = router;
