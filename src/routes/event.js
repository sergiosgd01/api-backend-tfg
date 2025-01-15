const express = require('express');
const { 
  getEvents, 
  getEventsOrganization, 
  getEventByCode, 
  getEventById, 
  changeStatusEvent, 
  createEvent, 
  editEvent, 
  deleteEvent 
} = require('../controllers/eventController');

const router = express.Router();

router.get('/', getEvents); 
router.get('/getEventById/:id', getEventById); 
router.get('/getEventsOrganization/:organizationCode', getEventsOrganization); 
router.get('/:eventCode', getEventByCode); 

router.put('/cancel/:eventCode', changeStatusEvent);
router.put('/editEvent/:eventCode', editEvent);

router.post('/', createEvent);

router.delete('/:eventCode', deleteEvent);

module.exports = router;