const express = require('express');
const { getRoute, deleteRoute, createRoute } = require('../controllers/routeController');
const router = express.Router();

router.get('/:code', getRoute);

router.post('/', createRoute);

router.delete('/:id', deleteRoute);

module.exports = router;
