const express = require('express');
const { getLocation, verifyDeviceId, insertLocation, getLocationDorsal, createLocation } = require('../controllers/locationController');
const router = express.Router();

router.get('/verifyDeviceId', verifyDeviceId);

router.get('/getLocationDorsal', getLocationDorsal);

router.get('/:code', getLocation);

router.post('/', insertLocation);

router.post('/create', createLocation);

module.exports = router;
