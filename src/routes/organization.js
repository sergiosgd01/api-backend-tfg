const express = require('express');
const { getOrganizations } = require('../controllers/organizationController');
const router = express.Router();

router.get('/', getOrganizations);

module.exports = router;