const express = require('express');
const { getEvents, getEventById, changeStatusEvent, getEventQRCode } = require('../controllers/eventController');
const router = express.Router();

router.get('/', getEvents);

router.get('/getEventQRCode', getEventQRCode);

router.put('/cancel/:code', changeStatusEvent);

router.get('/:code', getEventById);

module.exports = router;
