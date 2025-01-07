const express = require('express');
const { getService, deleteService, deleteAllServicesByEventCode, createService } = require('../controllers/serviceController');
const router = express.Router();

router.get('/:code', getService);

router.post('/', createService);

router.delete('/:id', deleteService);

router.delete('/deleteAll/:code', deleteAllServicesByEventCode);

module.exports = router;
