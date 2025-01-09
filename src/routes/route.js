const express = require('express');
const { 
  getRouteByEventCode, 
  deleteRoute, 
  createRoute, 
  deleteRoutesByEventCode 
} = require('../controllers/routeController');

const router = express.Router();

router.get('/:code', getRouteByEventCode);

router.post('/', createRoute);

router.delete('/:id', deleteRoute);

router.delete('/event/:code', deleteRoutesByEventCode);

module.exports = router;
