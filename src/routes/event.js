const express = require('express');
const { getEvents, getEventsOrganization, getEventById, changeStatusEvent, getEventQRCode, createEvent, editEvent, deleteEvent } = require('../controllers/eventController');
const router = express.Router();

router.get('/', getEvents); 
router.get('/:id', getEventById); 
router.get('/getEventQRCode', getEventQRCode); 
router.get('/getEventsOrganization/:organizationCode', getEventsOrganization); 

router.put('/cancel/:id', changeStatusEvent);
router.put('/editEvent/:id', editEvent);

router.post('/', createEvent);

router.delete('/:id', deleteEvent);

module.exports = router;