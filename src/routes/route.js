const express = require('express');
const { getRoute, deleteRoute, createRoute } = require('../controllers/routeController');
const router = express.Router();

router.get('/:code', getRoute);

router.delete('/:id', deleteRoute);

router.post('/', createRoute);

module.exports = router;
