const Location = require('../model/location'); 

const getLocation = async (req, res) => {
  const code = Number(req.params.code);

  try {
    const locations = await Location.find({ code }); 

    if (locations.length > 0) {
      res.status(200).json(locations);
    } else {
      res.status(404).json({ message: 'No se encontraron marcadores de ubicación.' });
    }
  } catch (error) {
    console.error('Error al obtener los marcadores de ubicación:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getLocation,
};
