const Event = require('../model/event'); 

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los eventos', error });
  }
};

const getEventById = async (req, res) => {
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
  const { code, name, province, time_distance, multiuser, status, cancelledInfo, startDate, endDate, organizationCode } = req.body;

  if (
    code === undefined ||
    name === undefined ||
    province === undefined ||
    time_distance === undefined ||
    multiuser === undefined ||
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
      province, 
      time_distance, 
      multiuser, 
      status, 
      cancelledInfo,
      startDate: new Date(startDate).toISOString().replace('Z', '-01:00'),
      endDate: new Date(endDate).toISOString().replace('Z', '-01:00'),
      organizationCode, 
      image: '',
      qrCode: '',
    });

    console.log("Datos del evento:", newEvent);

    await newEvent.save();

    res.status(201).json({ message: 'Evento creado exitosamente.', event: newEvent });
  } catch (error) {
    console.error("Error al crear el evento:", error);
    res.status(500).json({ message: 'Error al crear el evento', error: error.message || error });
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

const updateNameEvent = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (name === undefined) {
    return res.status(400).json({ message: 'Faltan parámetros: name es obligatorio.' });
  }

  try {
    const event = await Event.findOne({_id: id});

    if (event) {
      event.name = name;
      await event.save();

      res.status(200).json({ message: 'Nombre del evento actualizado correctamente.' });
    } else {
      res.status(404).json({ message: 'Evento no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar nombre del evento', error });
  }
};

const updateDateEvent = async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Faltan parámetros: startDate y endDate son obligatorios.' });
  }

  try {
    const event = await Event.findOne({_id: id});

    if (event) {
      event.startDate = new Date(startDate).toISOString().replace('Z', '-01:00');
      event.endDate = new Date(endDate).toISOString().replace('Z', '-01:00');
      await event.save();

      res.status(200).json({ message: 'La fecha del evento actualizado correctamente.' });
    } else {
      res.status(404).json({ message: 'Evento no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la fecha del evento', error });
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

module.exports = {
  getEvents,
  getEventById,
  changeStatusEvent,
  updateNameEvent,
  updateDateEvent,
  getEventQRCode,
  createEvent
};
