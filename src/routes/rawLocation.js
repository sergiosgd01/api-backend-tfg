const express = require('express');
const router = express.Router();
const {
  insertRawLocation,
  getRawLocationsByEventCode,
  deleteRawLocationsByEventCode,
} = require('../controllers/rawLocationController');

router.get('/:code', getRawLocationsByEventCode);

router.post('/', insertRawLocation);

router.delete('/:code', deleteRawLocationsByEventCode);

module.exports = router;
