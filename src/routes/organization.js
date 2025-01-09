const express = require('express');
const {
  getOrganizations,
  getOrganizationById, 
  getOrganizationByCode,
  createOrganization,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizationController');

const router = express.Router();

router.get('/', getOrganizations);
router.get('/:id', getOrganizationById); 
router.get('/code/:code', getOrganizationByCode);

router.post('/', createOrganization);

router.put('/:id', updateOrganization);

router.delete('/:id', deleteOrganization);

module.exports = router;
