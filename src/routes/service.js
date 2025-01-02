const express = require('express');
const { getService, deleteService, createService } = require('../controllers/serviceController');
const router = express.Router();

router.get('/:code', getService);

router.post('/', createService);

router.delete('/:id', deleteService);

module.exports = router;
