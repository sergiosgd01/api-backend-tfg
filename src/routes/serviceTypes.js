const express = require('express');
const {
  getServiceTypes,
  createServiceType,
  deleteServiceType,
} = require('../controllers/serviceTypesController');

const router = express.Router();

router.get('/', getServiceTypes);

router.post('/', createServiceType);

router.delete('/:id', deleteServiceType);

module.exports = router;
