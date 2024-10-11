const service = require('../data/services.json'); 

const getService = (req, res) => {
  const code = Number(req.params.code);

  try {
    const services = service.filter(service => service.code === code);

    if (services.length > 0) {
      res.status(200).json(services);
    } else {
      res.status(404).json({ message: 'No se encontraron marcadores de los servicios.' });
    }
  } catch (error) {
    console.error('Error al obtener los marcadores de los servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getService,
};
