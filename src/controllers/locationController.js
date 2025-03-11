const Location = require('../model/location'); 
const Event = require('../model/event');

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
  const { location, code } = req.body;
  let { deviceID } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'El código del evento es obligatorio.' });
  }

  try {
    // Check if event exists and if it's multiDevice
    const event = await Event.findOne({ code });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }
    
    // If event is multiDevice, deviceID is required
    if (event.multiDevice && !deviceID) {
      return res.status(400).json({ 
        message: 'Se requiere deviceID para eventos con múltiples dispositivos.' 
      });
    }
    
    // For non-multiDevice events, deviceID should be null
    if (!event.multiDevice) {
      deviceID = null;
    }

    // Register the location
    const newLocation = new Location({ 
      ...location, 
      code, 
      deviceID: event.multiDevice ? deviceID : null 
    });
    
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

const deleteAllLocations = async (req, res) => {
  const { eventCode, deviceID } = req.query;
  
  if (!eventCode) {
    return res.status(400).json({ message: 'El código del evento es obligatorio.' });
  }

  const numericEventCode = Number(eventCode);
  
  try {
    // Check if event exists and if it's multiDevice
    const event = await Event.findOne({ code: numericEventCode });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }
    
    // If event is multiDevice and no deviceID provided, return error
    if (event.multiDevice && !deviceID) {
      return res.status(400).json({ 
        message: 'Se requiere deviceID para eliminar ubicaciones de eventos con múltiples dispositivos.' 
      });
    }
    
    console.log(`Eliminando ubicaciones para el evento con código: ${numericEventCode}${deviceID ? ` y dispositivo: ${deviceID}` : ''}`);

    // Prepare query based on whether deviceID is provided and if event is multiDevice
    const query = (event.multiDevice && deviceID) ? 
      { code: numericEventCode, deviceID } : 
      { code: numericEventCode };
    
    const result = await Location.deleteMany(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'No se encontraron ubicaciones para eliminar.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} ubicaciones${deviceID ? ` del dispositivo ${deviceID}` : ''} en el evento con código: ${numericEventCode}.`,
    });
  } catch (error) {
    console.error('Error al eliminar las ubicaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const verifyDeviceId = async (req, res) => {
  const { deviceID, code } = req.query;

  try {
    if (!code) {
      return res.status(400).json({ message: 'El código del evento es obligatorio.' });
    }
    
    // Check if event exists and if it's multiDevice
    const event = await Event.findOne({ code: Number(code) });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }
    
    // For multiDevice events, deviceID is required
    if (event.multiDevice && !deviceID) {
      return res.status(400).json({ 
        message: 'Se requiere deviceID para eventos con múltiples dispositivos.' 
      });
    }
    
    // For non-multiDevice events, there's no need to verify deviceID
    if (!event.multiDevice) {
      return res.status(200).json({ 
        success: true, 
        message: 'El evento no requiere verificación de deviceID.'
      });
    }
    
    const location = await Location.findOne({ deviceID, code: Number(code) });
    
    if (location) {
      return res.status(200).json({ success: true, location: location });
    }

    return res.status(200).json({ 
      success: false, 
      message: 'No se ha encontrado ninguna ubicación con ese deviceID' 
    });
  } catch (error) {
    console.error('Error al verificar deviceID:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getLocationByEventCode,
  getLocationsByEventCodeDeviceID,
  insertLocation,
  verifyDeviceId,
  deleteLocation,
  deleteAllLocations,
};
