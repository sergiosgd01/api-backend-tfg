const express = require('express');
const { 
  getLocationByEventCode, 
  getLocationsByEventCodeDeviceID,
  insertLocation, 
  deleteLocation, 
  deleteAllLocations,  
  verifyDeviceId       
} = require('../controllers/locationController');
const router = express.Router();

// Get routes
router.get('/device', getLocationsByEventCodeDeviceID); 
router.get('/verify', verifyDeviceId); 
router.get('/:code', getLocationByEventCode);

// Post routes
router.post('/', insertLocation);

// Delete routes
router.delete('/deleteAll', deleteAllLocations); 
router.delete('/:id', deleteLocation); 

module.exports = router;