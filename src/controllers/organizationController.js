const Organization = require('../model/organization');

const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({});
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las organizaciones', error });
  }
};

const generateUniqueCode = async () => {
  let code;
  let exists = true;
  do {
    code = Math.floor(Math.random() * (999 - 1 + 1)) + 1; // Número entre 1 y 999
    exists = await Organization.exists({ code });
  } while (exists);
  return code;
};

const createOrganization = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  try {
    const code = await generateUniqueCode();
    const newOrganization = new Organization({ code, name });
    await newOrganization.save();
    res.status(201).json({ message: 'Organización creada exitosamente', organization: newOrganization });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la organización', error });
  }
};

const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    organization.name = name;
    await organization.save();

    res.status(200).json({ message: 'Organización actualizada exitosamente', organization });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la organización', error });
  }
};

const deleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findByIdAndDelete(id);
    if (!organization) {
      return res.status(404).json({ message: 'Organización no encontrada' });
    }

    res.status(200).json({ message: 'Organización eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la organización', error });
  }
};

module.exports = {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
};
