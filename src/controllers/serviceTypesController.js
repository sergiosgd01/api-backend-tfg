const ServiceType = require('../model/serviceType');

// Generar un `type` único
const generateUniqueType = async () => {
  let type;
  let exists = true;

  do {
    type = Math.floor(Math.random() * 99) + 1; // Genera un número entre 1 y 99
    exists = await ServiceType.exists({ type });
  } while (exists);

  return type;
};

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

// Crear un nuevo tipo de servicio con generación automática de `type`
const createServiceType = async (req, res) => {
  const { name, image } = req.body;

  // Validar los datos de entrada
  if (!name || !image) {
    return res.status(400).json({ message: 'Faltan datos obligatorios (nombre e imagen).' });
  }

  try {
    // Generar un tipo único
    const type = await generateUniqueType();

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
