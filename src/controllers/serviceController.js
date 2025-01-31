const Service = require('../model/service'); 

// const getServiceByEventCode = async (req, res) => {
//   const code = Number(req.params.code);

//   try {
//     const services = await Service.find({ code }); 

//     if (services.length > 0) {
//       res.status(200).json(services);
//     } else {
//       res.status(200).json({ message: 'No se encontraron servicios para este código', services: [] });
//     }
//   } catch (error) {
//     console.error('Error al obtener los marcadores de los servicios:', error);
//     res.status(500).json({ message: 'Error interno del servidor.' });
//   }
// };

const getServicesByEventCodeDeviceID = async (req, res) => {
  const { code, deviceID } = req.query;
  try {
    if (!code || !deviceID) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos: code o deviceID.' });
    }
    const numericCode = Number(code);
    if (isNaN(numericCode)) {
      return res.status(400).json({ message: 'El parámetro code debe ser un número válido.' });
    }
    const services = await Service.find({ code: numericCode, deviceID });
    if (services.length === 0) {
      return res.status(200).json({ message: 'No se encontraron servicios para este dispositivo en este evento.', services: [] });
    }
    res.status(200).json(services);
  } catch (error) {
    console.error('Error al obtener servicios por code y deviceID:', error);
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

const deleteAllServicesByEventCodeDeviceID = async (req, res) => {
  const code = Number(req.params.code);
  const deviceID = req.params.deviceID;

  try {
    console.log(`Eliminando todos los servicios para el evento con código: ${code} y deviceID: ${deviceID}`);

    const result = await Service.deleteMany({ code, deviceID });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'No se encontraron servicios para este evento y deviceID.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} servicios del evento con código: ${code} y deviceID: ${deviceID}.`,
    });
  } catch (error) {
    console.error('Error al eliminar los servicios por código de evento y deviceID:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createService = async (req, res) => {
  const { code, latitude, longitude, type, deviceID } = req.body;
  if (!code || !latitude || !longitude || !type || !deviceID) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para crear el servicio.' });
  }
  try {
    const service = new Service({ code, latitude, longitude, type, deviceID });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  // getServiceByEventCode,
  getServicesByEventCodeDeviceID, 
  deleteService,
  deleteAllServicesByEventCodeDeviceID,
  createService,
};
