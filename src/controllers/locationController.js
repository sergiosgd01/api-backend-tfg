const Location = require('../model/location'); 

const getLocation = async (req, res) => {
  const code = Number(req.params.code);

  try {
    const locations = await Location.find({ code }); 

    res.status(200).json(locations);
    
  } catch (error) {
    console.error('Error al obtener los marcadores de ubicación:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const insertLocation = async (req, res) => {
  const { location } = req.body;

  try {
    const newLocation = new Location(location);
    await newLocation.save();

    res.status(201).json({ success: true, location });
  } catch (error) {
    console.error('Error al insertar la ubicación:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteLocation = async (req, res) => { 
  const id = req.params.id;

  try {
    const location = await Location.findByIdAndDelete(id);

    if (location) {
      res.status(200).json({ message: 'Punto de las ubicaciones eliminado correctamente.', location });
    } else {
      res.status(404).json({ message: 'No se encontró el punto de las ubicaciones.' });
    }
  } catch (error) {
    console.error('Error al eliminar el punto de las ubicaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteLocationsByEventCode = async (req, res) => {
  const code = Number(req.params.code);

  try {
    console.log(`Eliminando todas las ubicaciones para el evento con código: ${code}`);

    const result = await Location.deleteMany({ code });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'No se encontraron ubicaciones para este evento.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} ubicaciones del evento con código: ${code}.`,
    });
  } catch (error) {
    console.error('Error al eliminar las ubicaciones por código de evento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const verifyDeviceId = async (req, res) => {
  const { deviceID, code } = req.query;

  try {
    const location = await Location.findOne({ deviceID, code });
    
    if (location) {
      return res.status(200).json({ success: true, location: location });
    }

    return res.status(200).json({ success: false, message: 'No se ha encontrado ninguna ubicacion con ese deviceID' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getLocationDorsal = async (req, res) => {
  const { code, dorsal } = req.query;

  try {
    const location = await Location.findOne({ dorsal, code });

    if (location) {
      return res.status(200).json({ success: true, location: location });
    }

    return res.status(200).json({ success: false, message: 'No se ha encontrado ninguna ubicacion con este dorsal' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getLocation,
  insertLocation,
  verifyDeviceId,
  getLocationDorsal, 
  deleteLocation,
  deleteLocationsByEventCode,
};
