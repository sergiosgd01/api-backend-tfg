const express = require('express');
const { getLocation, verifyDeviceId, insertLocation, getLocationDorsal } = require('../controllers/locationController');
const router = express.Router();

router.get('/verifyDeviceId', verifyDeviceId);

router.get('/getLocationDorsal', getLocationDorsal);

router.get('/:code', getLocation);

router.post('/', insertLocation);

module.exports = router;
