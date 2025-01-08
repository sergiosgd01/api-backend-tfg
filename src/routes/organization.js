const express = require('express');
const {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizationController');
const router = express.Router();

router.get('/', getOrganizations); 
router.post('/', createOrganization); 
router.put('/:id', updateOrganization); 
router.delete('/:id', deleteOrganization); 

module.exports = router;
