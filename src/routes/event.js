const express = require('express');
const { 
  getEvents, 
  getEventsOrganization, 
  getEventByCode, 
  checkCodeExists, 
  getEventById, 
  changeStatusEvent, 
  getEventQRCode, 
  createEvent, 
  editEvent, 
  deleteEvent 
} = require('../controllers/eventController');

const router = express.Router();

router.get('/', getEvents); 
router.get('/getEventById/:id', getEventById); 
// router.get('/getEventQRCode', getEventQRCode); 
router.get('/checkCodeExists/:code', checkCodeExists);
router.get('/getEventsOrganization/:organizationCode', getEventsOrganization); 
router.get('/:code', getEventByCode); 

router.put('/cancel/:id', changeStatusEvent);
router.put('/editEvent/:id', editEvent);

router.post('/', createEvent);

router.delete('/:id', deleteEvent);

module.exports = router;