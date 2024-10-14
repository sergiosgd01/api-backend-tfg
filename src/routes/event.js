const express = require('express');
const { getEvents, getEventById, changeStatusEvent, getEventQRCode, updateNameEvent, updateDateEvent } = require('../controllers/eventController');
const router = express.Router();

router.get('/', getEvents);

router.get('/getEventQRCode', getEventQRCode);

router.put('/cancel/:id', changeStatusEvent);

router.put('/updateName/:id', updateNameEvent);

router.put('/updateDate/:id', updateDateEvent);

router.get('/:code', getEventById);

module.exports = router;
