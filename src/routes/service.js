const express = require('express');
const { getService } = require('../controllers/serviceController');
const router = express.Router();

router.get('/:code', getService);

module.exports = router;
