const ServiceType = require('../model/serviceType');

// Obtener todos los tipos de servicios
const getServiceTypes = async (req, res) => {
  try {
    const types = await ServiceType.find({});
    res.status(200).json(types);
  } catch (error) {
    console.error('Error al obtener los tipos de servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Crear un nuevo tipo de servicio
const createServiceType = async (req, res) => {
  const { type, name, image } = req.body;

  // Validar los datos de entrada
  if (type === undefined || name === undefined || image === undefined) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  if (type < 0 || type > 99) {
    return res.status(400).json({ message: 'El tipo debe ser un número entre 0 y 99.' });
  }

  try {
    // Verificar que el tipo no exista
    const exists = await ServiceType.exists({ type });
    if (exists) {
      return res.status(400).json({ message: 'El tipo de servicio ya existe.' });
    }

    // Crear el nuevo tipo
    const newServiceType = new ServiceType({ type, name, image });
    await newServiceType.save();
    res.status(201).json({ message: 'Tipo de servicio creado exitosamente.', serviceType: newServiceType });
  } catch (error) {
    console.error('Error al crear el tipo de servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Eliminar un tipo de servicio
const deleteServiceType = async (req, res) => {
  const { id } = req.params;

  try {
    const serviceType = await ServiceType.findByIdAndDelete(id);

    if (!serviceType) {
      return res.status(404).json({ message: 'Tipo de servicio no encontrado.' });
    }

    res.status(200).json({ message: 'Tipo de servicio eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el tipo de servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getServiceTypes,
  createServiceType,
  deleteServiceType,
};
