const Route = require('../model/route'); 

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

const getRouteByDeviceId = async (req, res) => {
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
      return res.status(404).json({ message: 'No se encontró ruta para este deviceID en este evento.' });
    }

    res.status(200).json(route);
  } catch (error) {
    console.error('Error al obtener la ruta por deviceID y código:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteRoute = async (req, res) => {
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

const createRoute = async (req, res) => {
  const { code, latitude, longitude, deviceID } = req.body;

  if (!code || !latitude || !longitude || !deviceID) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para insertar el punto de la ruta.' });
  }

  try {
    const route = new Route({
      code,
      latitude,
      longitude,
      visited: false,
      deviceID 
    });

    await route.save();

    res.status(201).json(route);
  } catch (error) {
    console.error('Error al crear el punto de la ruta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteRoutesByEventCode = async (req, res) => {
  const code = Number(req.params.code);

  try {
    console.log(`Eliminando todas las rutas para el evento con código: ${code}`);

    const result = await Route.deleteMany({ code });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'No se encontraron rutas para este evento.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} rutas del evento con código: ${code}.`,
    });
  } catch (error) {
    console.error('Error al eliminar las rutas por código de evento:', error);
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
  getRouteByDeviceId,
  deleteRoute,
  createRoute,
  deleteRoutesByEventCode,
  updateVisitedStatus,
  resetVisitedStatusByEventCode,
};
