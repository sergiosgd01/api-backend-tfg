const express = require('express');
const { getServiceTypes } = require('../controllers/serviceTypesController');
const router = express.Router();

router.get('/', getServiceTypes);

module.exports = router;
