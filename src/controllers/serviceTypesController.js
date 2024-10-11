const ServiceType = require('../model/serviceType'); 

const getServiceTypes = async (req, res) => {
  try {
    const types = await ServiceType.find({}); 

    if (types.length > 0) {
      res.status(200).json(types);
    } else {
      res.status(404).json({ message: 'No se encontraron los tipos de servicios.' });
    }
  } catch (error) {
    console.error('Error al obtener los tipos de servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getServiceTypes,
};
