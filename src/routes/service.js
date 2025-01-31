const express = require('express');
const { 
  getServiceByEventCode, 
  getServicesByEventCodeDeviceID, 
  deleteService, 
  deleteAllServicesByEventCodeDeviceID, 
  createService 
} = require('../controllers/serviceController');

const router = express.Router();

// router.get('/:code', getServiceByEventCode);

router.get('/', getServicesByEventCodeDeviceID);

router.post('/', createService);

router.delete('/:id', deleteService);

router.delete('/deleteAll/:code/device/:deviceID', deleteAllServicesByEventCodeDeviceID);

module.exports = router;
