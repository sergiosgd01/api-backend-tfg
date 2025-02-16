const Location = require('../model/location'); 

const getLocationByEventCode = async (req, res) => {
  const code = Number(req.params.code);

  try {
    const locations = await Location.find({ code }); 

    res.status(200).json(locations);
    
  } catch (error) {
    console.error('Error al obtener los marcadores de ubicación:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getLocationsByEventCodeDeviceID = async (req, res) => {
  const { deviceID, code } = req.query;

  try {
    // Verifica que los parámetros estén presentes
    if (!deviceID || !code) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos: deviceID o code.' });
    }

    // Convertir `code` a un número y validar
    const numericCode = Number(code);
    if (isNaN(numericCode)) {
      return res.status(400).json({ message: 'El parámetro code debe ser un número válido.' });
    }

    // Consultar las ubicaciones
    const locations = await Location.find({ deviceID, code: numericCode });

    if (locations.length === 0) {
      // Devolver 200 con mensaje y array vacío
      return res.status(200).json({ message: 'No se encontraron ubicaciones para este dispositivo en este evento.', locations: [] });
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error al obtener ubicaciones por deviceID y código:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const insertLocation = async (req, res) => {
  const { location, code, deviceID } = req.body;

  try {
    // Registrar la ubicación
    const newLocation = new Location({ ...location, code, deviceID });
    await newLocation.save();

    res.status(201).json({ success: true, location: newLocation });
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

const deleteLocationsByDeviceAndEvent = async (req, res) => {
  const eventCode = Number(req.params.eventCode);
  const deviceID = req.params.deviceID;

  try {
    console.log(`Eliminando todas las ubicaciones para el evento con código: ${eventCode} y dispositivo: ${deviceID}`);

    const result = await Location.deleteMany({ code: eventCode, deviceID });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'No se encontraron ubicaciones para este evento y dispositivo.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} ubicaciones del dispositivo ${deviceID} en el evento con código: ${eventCode}.`,
    });
  } catch (error) {
    console.error('Error al eliminar las ubicaciones por código de evento y dispositivo:', error);
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

// const getLocationDorsal = async (req, res) => {
//   const { code, dorsal } = req.query;

//   try {
//     const location = await Location.findOne({ dorsal, code });

//     if (location) {
//       return res.status(200).json({ success: true, location: location });
//     }

//     return res.status(200).json({ success: false, message: 'No se ha encontrado ninguna ubicacion con este dorsal' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error interno del servidor.' });
//   }
// };

module.exports = {
  getLocationByEventCode,
  getLocationsByEventCodeDeviceID,
  insertLocation,
  verifyDeviceId,
  // getLocationDorsal, 
  deleteLocation,
  deleteLocationsByDeviceAndEvent,
};
