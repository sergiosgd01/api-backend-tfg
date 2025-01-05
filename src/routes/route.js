const express = require('express');
const { getRoute, deleteRoute, createRoute, deleteRoutesByEventCode } = require('../controllers/routeController');
const router = express.Router();

router.get('/:code', getRoute);

router.post('/', createRoute);

router.delete('/:id', deleteRoute);

router.delete('/event/:code', deleteRoutesByEventCode);

module.exports = router;
