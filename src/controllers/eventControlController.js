const EventControl = require('../model/eventControl');

// Obtener configuración de control por eventCode
const getEventControl = async (req, res) => {
  const { eventCode } = req.params;

  try {
    const control = await EventControl.findOne({ eventCode: Number(eventCode) });

    if (!control) {
      return res.status(404).json({ message: 'Control no encontrado para el evento.' });
    }

    res.status(200).json(control);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el control del evento.', error });
  }
};

// Crear una entrada de control al crear un evento
const createEventControl = async (eventCode, updateFrequency) => {
  try {
    const control = new EventControl({
      eventCode,
      updateFrequency,
    });

    await control.save();
    return control;
  } catch (error) {
    throw new Error('Error al crear la configuración de control: ' + error.message);
  }
};

// Actualizar configuración de control por eventCode
const updateEventControl = async (req, res) => {
  const { eventCode } = req.params;
  const { isTrackingEnabled, updateFrequency, accuracy } = req.body;

  try {
    const control = await EventControl.findOne({ eventCode: Number(eventCode) });

    if (!control) {
      return res.status(404).json({ message: 'Control no encontrado para el evento.' });
    }

    if (isTrackingEnabled !== undefined) control.isTrackingEnabled = isTrackingEnabled;
    if (updateFrequency !== undefined) control.updateFrequency = updateFrequency;
    if (accuracy !== undefined) control.accuracy = accuracy;

    control.lastUpdated = new Date();
    await control.save();

    res.status(200).json({ message: 'Control actualizado con éxito.', control });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el control.', error });
  }
};

// Eliminar control por eventCode
const deleteEventControl = async (eventCode) => {
  try {
    await EventControl.findOneAndDelete({ eventCode: Number(eventCode) });
  } catch (error) {
    throw new Error('Error al eliminar el control: ' + error.message);
  }
};

module.exports = {
  getEventControl,
  createEventControl,
  updateEventControl,
  deleteEventControl,
};
