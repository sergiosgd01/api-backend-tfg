const Route = require('../model/route'); 

const getRoute = async (req, res) => {
  const code = Number(req.params.code);

  try {
    const routes = await Route.find({ code }); 

    if (routes.length > 0) {
      res.status(200).json(routes);
    } else {
      res.status(404).json({ message: 'No se encontraron marcadores de la ruta.' });
    }
  } catch (error) {
    console.error('Error al obtener los marcadores de la ruta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getRoute,
};
