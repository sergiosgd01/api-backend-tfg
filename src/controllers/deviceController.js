const Device = require('../model/device');
const Event = require('../model/event');

// Verificar si un dispositivo existe para un eventCode
const verifyDevice = async (req, res) => {
  const { deviceID, eventCode } = req.query;

  try {
    const device = await Device.findOne({ deviceID, eventCode });

    if (device) {
      return res.status(200).json({ exists: true, device });
    } else {
      return res.status(200).json({ exists: false, message: 'Dispositivo no encontrado' });
    }
  } catch (error) {
    console.error('Error verificando dispositivo:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

// Crear un nuevo dispositivo
const createDevice = async (req, res) => {
  const { deviceID, eventCode, name, color, icon } = req.body;

  try {
    // Verificar si el evento existe
    const eventExists = await Event.findOne({ code: eventCode });
    if (!eventExists) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Obtener el número actual de dispositivos para el evento
    const deviceCount = await Device.countDocuments({ eventCode });

    // Asignar automáticamente el valor de "order"
    const order = deviceCount + 1;

    // Crear un nuevo dispositivo
    const device = new Device({ deviceID, eventCode, name, order, color, icon });
    await device.save();

    return res.status(201).json({ success: true, device });
  } catch (error) {
    console.error('Error creando dispositivo:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación en los datos enviados', details: error.errors });
    }

    return res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

// Editar datos de un dispositivo
const editDevice = async (req, res) => {
  const { deviceID, eventCode } = req.params;
  const { name, color, order, icon } = req.body;

  try {
    // Encontrar y actualizar el dispositivo
    const updatedDevice = await Device.findOneAndUpdate(
      { deviceID, eventCode },
      { name, color, order, icon },
      { new: true, runValidators: true } // Devuelve el documento actualizado y aplica validaciones
    );

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    return res.status(200).json({ success: true, device: updatedDevice });
  } catch (error) {
    console.error('Error editando dispositivo:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación en los datos enviados', details: error.errors });
    }

    return res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

// Obtener todos los dispositivos por eventCode
const getDevicesByEventCode = async (req, res) => {
  const { eventCode } = req.params;
  try {
    const devices = await Device.find({ eventCode });
    if (devices.length === 0) {
      return res.status(200).json({ message: 'No se encontraron dispositivos para este eventCode.', devices: [] });
    }
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error al obtener dispositivos por eventCode:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener dispositivos por deviceID
const getDevicesByDeviceID = async (req, res) => {
  const { deviceID } = req.params;

  try {
    const devices = await Device.find({ deviceID });

    if (devices.length === 0) {
      return res.status(404).json({ message: 'No se encontraron dispositivos con este ID' });
    }

    return res.status(200).json({ devices });
  } catch (error) {
    console.error('Error obteniendo dispositivos por deviceID:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

// Obtener dispositivo por deviceID y eventCode
const getDeviceByDeviceIDEventCode = async (req, res) => {
  const { deviceID, eventCode } = req.params;
  try {
    const device = await Device.findOne({ deviceID, eventCode });
    if (!device) {
      return res.status(200).json({ message: 'No se encontró dispositivo para este deviceID y eventCode.', devices: [] });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error('Error al obtener dispositivo por deviceID y eventCode:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
// .

const deleteDeviceById = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await Device.findByIdAndDelete(id);
    if (!device) {
      return res.status(404).json({ message: 'Dispositivo no encontrado.' });
    }
    res.status(200).json({ message: 'Dispositivo eliminado correctamente.', device });
  } catch (error) {
    console.error('Error al eliminar el dispositivo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  verifyDevice,
  createDevice,
  editDevice,
  getDevicesByEventCode,
  getDevicesByDeviceID,
  getDeviceByDeviceIDEventCode,
  deleteDeviceById,
};
