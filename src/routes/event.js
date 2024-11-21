const express = require('express');
const { getEvents, getEventById, changeStatusEvent, getEventQRCode, createEvent, editEvent } = require('../controllers/eventController');
const router = express.Router();

router.get('/', getEvents);

router.get('/getEventQRCode', getEventQRCode);

router.put('/cancel/:id', changeStatusEvent);

router.get('/:code', getEventById);

router.post('/', createEvent);

router.put('/editEvent/:id', editEvent);

module.exports = router;