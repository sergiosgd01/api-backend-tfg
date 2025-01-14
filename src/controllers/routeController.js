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

const deleteRoute = async (req, res) => {
  const id = req.params.id;

  try {
    const route = await Route.findByIdAndDelete(id);

    if (route) {
      // Recalcular los valores de "order" después de eliminar un punto
      const remainingRoutes = await Route.find({ code: route.code }).sort({ order: 1 });
      for (let i = 0; i < remainingRoutes.length; i++) {
        remainingRoutes[i].order = i;
        await remainingRoutes[i].save();
      }

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
  const { code, latitude, longitude } = req.body;

  if (!code || !latitude || !longitude) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para insertar el punto de la ruta.' });
  }

  try {
    // Obtener el valor máximo de "order" para esta ruta
    const lastRoutePoint = await Route.findOne({ code }).sort({ order: -1 });
    const nextOrder = lastRoutePoint ? lastRoutePoint.order + 1 : 0;

    const route = new Route({
      code,
      latitude,
      longitude,
      visited: false, // Aseguramos que este campo se establezca como false
      order: nextOrder, // Asignamos el orden incremental
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
  deleteRoute,
  createRoute,
  deleteRoutesByEventCode,
  updateVisitedStatus,
  resetVisitedStatusByEventCode,
};
