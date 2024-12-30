const express = require('express');
const { getEvents, getEventsOrganization, getEventById, changeStatusEvent, getEventQRCode, createEvent, editEvent, deleteEvent } = require('../controllers/eventController');
const router = express.Router();

router.get('/', getEvents);

router.get('/getEventsOrganization/:organizationCode', getEventsOrganization);

router.get('/getEventQRCode', getEventQRCode);

router.get('/:code', getEventById);

router.put('/cancel/:id', changeStatusEvent);

router.post('/', createEvent);

router.put('/editEvent/:id', editEvent);

router.delete('/:id', deleteEvent);

module.exports = router;