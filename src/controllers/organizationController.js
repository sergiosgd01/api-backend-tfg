const Organization = require('../model/organization'); 

const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({});
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las organizaciones', error });
  }
};

module.exports = {
  getOrganizations
};
