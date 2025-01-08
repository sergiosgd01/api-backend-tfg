const express = require('express');
const {
  getOrganizations,
  getOrganizationById, // Importa el nuevo método
  createOrganization,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizationController');
const router = express.Router();

router.get('/', getOrganizations);
router.get('/:id', getOrganizationById); 

router.post('/', createOrganization);

router.put('/:id', updateOrganization);

router.delete('/:id', deleteOrganization);

module.exports = router;
