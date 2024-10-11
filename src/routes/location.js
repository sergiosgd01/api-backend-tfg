const express = require('express');
const { getLocation } = require('../controllers/locationController');
const router = express.Router();

router.get('/:code', getLocation);

module.exports = router;
