const Service = require('../model/service'); 

const getServiceByEventCode = async (req, res) => {
  const code = Number(req.params.code);

  try {
    const services = await Service.find({ code }); 

    if (services.length > 0) {
      res.status(200).json(services);
    } else {
      res.status(200).json({ message: 'No se encontraron servicios para este código', services: [] });
    }
  } catch (error) {
    console.error('Error al obtener los marcadores de los servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteService = async (req, res) => { 
  const id = req.params.id;

  try {
    const service = await Service.findByIdAndDelete(id);

    if (service) {
      res.status(200).json({ message: 'Servicio eliminado correctamente.', service });
    } else {
      res.status(404).json({ message: 'No se encontró el servicio a eliminar.' });
    }
  } catch (error) {
    console.error('Error al eliminar el servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteAllServicesByEventCode = async (req, res) => {
  const code = Number(req.params.code);

  try {
    console.log(`Eliminando todos los servicios para el evento con código: ${code}`);

    const result = await Service.deleteMany({ code });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'No se encontraron servicios para este evento.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} servicios del evento con código: ${code}.`,
    });
  } catch (error) {
    console.error('Error al eliminar los servicios por código de evento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createService = async (req, res) => {
  const { code, latitude, longitude, type } = req.body;
  
  if (!code || !latitude || !longitude || !type) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para crear el servicio.' });
  }

  try {
    const service = new Service({ code, latitude, longitude, type });
    await service.save();

    res.status(201).json(service);
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = {
  getServiceByEventCode,
  deleteService,
  deleteAllServicesByEventCode,
  createService,
};
