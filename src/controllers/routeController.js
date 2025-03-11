const Route = require('../model/route'); 
const Event = require('../model/event');

const getRouteByEventCode = async (req, res) => {
  const code = Number(req.params.code);

  try {
    const routes = await Route.find({ code });

    if (routes.length > 0) {
      res.status(200).json(routes);
    } else {
      res.status(200).json({ message: 'No se encontraron rutas para este código', routes: [] });
    }
  } catch (error) {
    console.error('Error al obtener los marcadores de la ruta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getRouteByEventCodeDeviceID = async (req, res) => {
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
    const route = await Route.find({ deviceID, code: numericCode });

    if (route.length === 0) {
      // En lugar de 404, devuelve un estado 200 con un mensaje informativo
      return res.status(200).json({ message: 'No hay ubicaciones para este dispositivo en este evento.', route: [] });
    }

    res.status(200).json(route);
  } catch (error) {
    console.error('Error al obtener la ruta por deviceID y código:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createRoutePoint = async (req, res) => {
  const { code, latitude, longitude } = req.body;
  let { deviceID } = req.body;

  if (!code || !latitude || !longitude) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para insertar el punto de la ruta.' });
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

    const route = new Route({
      code,
      latitude,
      longitude,
      visited: false,
      deviceID: event.multiDevice ? deviceID : null
    });

    await route.save();

    res.status(201).json({
      success: true,
      route: route
    });
  } catch (error) {
    console.error('Error al crear el punto de la ruta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteRoutePoint = async (req, res) => {
  const id = req.params.id;

  try {
    const route = await Route.findByIdAndDelete(id);

    if (route) {
      res.status(200).json({ message: 'Punto de la ruta eliminado correctamente.', route });
    } else {
      res.status(404).json({ message: 'No se encontró el punto de la ruta.' });
    }
  } catch (error) {
    console.error('Error al eliminar el punto de la ruta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteAllRoutes = async (req, res) => {
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
        message: 'Se requiere deviceID para eliminar rutas de eventos con múltiples dispositivos.' 
      });
    }
    
    console.log(`Eliminando rutas para el evento con código: ${numericEventCode}${deviceID ? ` y dispositivo: ${deviceID}` : ''}`);

    // Prepare query based on whether deviceID is provided and if event is multiDevice
    const query = (event.multiDevice && deviceID) ? 
      { code: numericEventCode, deviceID } : 
      { code: numericEventCode };
    
    const result = await Route.deleteMany(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'No se encontraron rutas para eliminar.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} rutas${deviceID ? ` del dispositivo ${deviceID}` : ''} en el evento con código: ${numericEventCode}.`,
    });
  } catch (error) {
    console.error('Error al eliminar las rutas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateVisitedStatus = async (req, res) => {
  const { pointIds } = req.body;

  if (!Array.isArray(pointIds) || pointIds.length === 0) {
    return res.status(400).json({ message: 'Se requiere un array de identificadores de puntos.' });
  }

  try {
    // Actualiza los puntos marcados como visitados en una sola operación
    await Route.updateMany({ _id: { $in: pointIds } }, { visited: true });

    res.status(200).json({ message: 'Puntos visitados actualizados correctamente.' });
  } catch (error) {
    console.error('Error actualizando puntos visitados:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const resetVisitedStatusByEventCode = async (req, res) => {
  const code = Number(req.params.code);

  try {
    const result = await Route.updateMany({ code }, { visited: false });

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: 'No se encontraron puntos de la ruta para este código o ya están reseteados.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Se actualizó el estado de visited a false para ${result.modifiedCount} puntos de la ruta con código: ${code}.`,
    });
  } catch (error) {
    console.error('Error al resetear el estado de visited:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getRouteByEventCode,
  getRouteByEventCodeDeviceID,
  deleteRoutePoint,
  createRoutePoint,
  deleteAllRoutes,
  updateVisitedStatus,
  resetVisitedStatusByEventCode,
};
