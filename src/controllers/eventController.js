const Event = require('../model/event'); 

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los eventos', error });
  }
};

const getEventsOrganization = async (req, res) => {
  const { organizationCode } = req.params;

  try {
    const events = await Event.find({ organizationCode: Number(organizationCode) });
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los eventos', error });
  }
};

const getEventByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const event = await Event.findOne({ code: Number(code) }); 

    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: 'Evento no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el evento', error });
  }
};

const createEvent = async (req, res) => {
  const { code, name, postalCode, time, status, cancelledInfo, startDate, endDate, organizationCode } = req.body;

  if (
    code === undefined ||
    name === undefined ||
    postalCode === undefined ||
    time === undefined ||
    status === undefined ||
    cancelledInfo === undefined ||
    startDate === undefined ||
    endDate === undefined ||
    organizationCode === undefined
  ) {
    return res.status(400).json({ message: 'Faltan parámetros obligatorios' });
  }
  
  try {
    const newEvent = new Event({
      code,
      name,
      postalCode, 
      time, 
      status, 
      cancelledInfo,
      startDate: new Date(startDate).toISOString().replace('Z', '-01:00'),
      endDate: new Date(endDate).toISOString().replace('Z', '-01:00'),
      organizationCode, 
      image: '',
      qrCode: '',
      icon: '',
    });

    await newEvent.save();

    res.status(201).json({ message: 'Evento creado exitosamente.', event: newEvent });
  } catch (error) {
    console.error("Error al crear el evento:", error);
    res.status(500).json({ message: 'Error al crear el evento', error: error.message || error });
  }
};

const editEvent = async (req, res) => {
  const { id } = req.params; 
  const { 
    code, 
    name, 
    postalCode, 
    time, 
    status, 
    cancelledInfo, 
    startDate, 
    endDate, 
    organizationCode 
  } = req.body;

  if (
    !code && 
    !name && 
    !postalCode && 
    !time && 
    !status && 
    !cancelledInfo && 
    !startDate && 
    !endDate && 
    !organizationCode
  ) {
    return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    if (code !== undefined) event.code = code;
    if (name !== undefined) event.name = name;
    if (postalCode !== undefined) event.postalCode = postalCode;
    if (time !== undefined) event.time = time;
    if (status !== undefined) event.status = status;
    if (cancelledInfo !== undefined) event.cancelledInfo = cancelledInfo;
    if (startDate !== undefined) event.startDate = new Date(startDate).toISOString().replace('Z', '-01:00');
    if (endDate !== undefined) event.endDate = new Date(endDate).toISOString().replace('Z', '-01:00');
    if (organizationCode !== undefined) event.organizationCode = organizationCode;

    await event.save();

    res.status(200).json({ message: 'Evento actualizado exitosamente.', event });
  } catch (error) {
    console.error("Error al actualizar el evento:", error);
    res.status(500).json({ message: 'Error al actualizar el evento', error: error.message || error });
  }
};

const changeStatusEvent = async (req, res) => {
  const { id } = req.params;
  const { action, cancelledInfo } = req.body;

  if (action === undefined || cancelledInfo === undefined) {
    return res.status(400).json({ message: 'Faltan parámetros: action y cancelledInfo son obligatorios.' });
  }

  try {
    const event = await Event.findOne({_id: id});

    if (event) {
      event.status = action;
      event.cancelledInfo = cancelledInfo;
      await event.save();

      res.status(200).json({ message: 'Evento cancelado/renaudado correctamente.' });
    } else {
      res.status(404).json({ message: 'Evento no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar el evento', error });
  }
};

const getEventQRCode = async (req, res) => {
  const { qrCode } = req.query;

  try {
    const event = await Event.findOne({ qrCode });

    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: 'Evento no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el evento con el código QR', error });
  }
}

const deleteEvent = async (req, res) => {
  const id = req.params.id;

  try {
    const event = await Event.findByIdAndDelete(id);

    if (event) {
      res.status(200).json({ message: 'El evento fue eliminado correctamente.', event });
    } else {
      res.status(404).json({ message: 'No se encontró el evento.' });
    }
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = {
  getEvents,
  getEventsOrganization,
  getEventByCode,
  changeStatusEvent,
  getEventQRCode,
  createEvent, 
  editEvent, 
  deleteEvent
};