const express = require('express');
const { 
  getServiceByEventCode, 
  deleteService, 
  deleteAllServicesByEventCode, 
  createService 
} = require('../controllers/serviceController');

const router = express.Router();

router.get('/:code', getServiceByEventCode);

router.post('/', createService);

router.delete('/:id', deleteService);

router.delete('/deleteAll/:code', deleteAllServicesByEventCode);

module.exports = router;
