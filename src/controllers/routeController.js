const Route = require('../model/route'); 

const getRoute = async (req, res) => {
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
      res.status(200).json({ message: 'Punto de la route eliminado correctamente.', route });
    } else {
      res.status(404).json({ message: 'No se encontró el punto de la route.' });
    }
  } catch (error) {
    console.error('Error al eliminar el punto de la route:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

const createRoute = async (req, res) => {
  const { code, latitude, longitude } = req.body;
  
  if (!code || !latitude || !longitude) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para insertar el punto de la route.' });
  }

  try {
    const route = new Route({ code, latitude, longitude });
    await route.save();

    res.status(201).json(route);
  } catch (error) {
    console.error('Error al crear el punto de la route:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = {
  getRoute,
  deleteRoute,
  createRoute,
};
