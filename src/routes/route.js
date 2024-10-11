const express = require('express');
const { getRoute } = require('../controllers/routeController');
const router = express.Router();

router.get('/:code', getRoute);

module.exports = router;
