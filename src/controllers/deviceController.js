const Device = require('../model/device');
const Event = require('../model/event');

const verifyOrCreateDevice = async (req, res) => {
  const { deviceID, eventCode, name, order, color } = req.body;

  try {
    // Verificar si el evento existe
    const eventExists = await Event.findOne({ code: eventCode });
    if (!eventExists) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Verificar si el dispositivo ya existe para ese eventCode
    let device = await Device.findOne({ deviceID, eventCode });
    if (!device) {
      // Crear un nuevo dispositivo si no existe
      device = new Device({ deviceID, eventCode, name, order, color });
      await device.save();
    }

    // Devolver el dispositivo existente o recién creado
    return res.status(200).json({ success: true, device });
  } catch (error) {
    console.error('Error en la verificación o creación del dispositivo:', error);

    // Manejo de errores específicos para evitar "Internal Server Error"
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación en los datos enviados', details: error.errors });
    }

    // Respuesta para cualquier otro error desconocido
    return res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

module.exports = {
  verifyOrCreateDevice,
};
