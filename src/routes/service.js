const express = require('express');
const { getService, deleteService, createService } = require('../controllers/serviceController');
const router = express.Router();

router.get('/:code', getService);

router.delete('/:id', deleteService);

router.post('/', createService);

module.exports = router;
