const express = require('express');
const { getEvents, getEventById } = require('../controllers/eventController');
const router = express.Router();

router.get('/', getEvents);

router.get('/:code', getEventById);

module.exports = router;
