const express = require('express');
const { 
  getLocation, 
  verifyDeviceId, 
  insertLocation, 
  getLocationDorsal, 
  deleteLocation, 
  deleteLocationsByEventCode 
} = require('../controllers/locationController');
const router = express.Router();

// router.get('/verifyDeviceId', verifyDeviceId);
// router.get('/getLocationDorsal', getLocationDorsal);
router.get('/:code', getLocation);

router.post('/', insertLocation);

router.delete('/:id', deleteLocation);
router.delete('/event/:code', deleteLocationsByEventCode);

module.exports = router;
