const Event = require('../model/event'); 
const { createEventControl } = require('./eventControlController');

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

const getEventById = async (req, res) => {
  const { id } = req.params;

  try {

    const event = await Event.findOne({ _id: id }); 

    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: 'Evento no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el evento', error });
  }
};

const getEventByCode = async (req, res) => {
  const { eventCode } = req.params;

  try {
    const event = await Event.findOne({ code: Number(eventCode) }); 

    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: 'Evento no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el evento', error });
  }
};

// const checkCodeExists = async (req, res) => {
//   const { code } = req.params;
//   const { id } = req.query;

//   try {
//     const query = id
//       ? { code: Number(code), _id: { $ne: id } } 
//       : { code: Number(code) }; 

//     const exists = await Event.exists(query);

//     res.status(200).json({ exists: !!exists });
//   } catch (error) {
//     res.status(500).json({ message: 'Error al verificar el código', error });
//   }
// };

const generateUniqueEventCode = async (postalCode) => {
  let code;
  let exists = true;
  do {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000; 
    code = parseInt(`${randomNumber}${postalCode}`, 10); 
    exists = await Event.exists({ code });
  } while (exists);
  return code;
};

const createEvent = async (req, res) => {
  const { 
    name, 
    postalCode, 
    time, 
    cancelledInfo, 
    startDate, 
    endDate, 
    organizationCode, 
    multiDevice,
    image,  // Añade estos dos campos
    icon    // a la desestructuración
  } = req.body;

  if (!name || !postalCode || !time || !startDate || !endDate || !organizationCode) {
    return res.status(400).json({ message: 'Faltan parámetros obligatorios' });
  }

  try {
    const code = await generateUniqueEventCode(postalCode); 

    const newEvent = new Event({
      code,
      name,
      postalCode,
      time,
      status: 0,
      cancelledInfo: cancelledInfo || '',
      startDate,
      endDate,
      organizationCode,
      image: image || '',  
      icon: icon || '',    
      multiDevice: multiDevice !== undefined ? multiDevice : false,
    });

    await newEvent.save();

    await createEventControl(code, time);

    res.status(201).json({ message: 'Evento creado exitosamente.', event: newEvent });
  } catch (error) {
    if (error.code === 11000 && error.keyValue?.code) {
      return res.status(400).json({ message: 'El código del evento ya existe. Por favor, intente nuevamente.' });
    }
    console.error('Error al crear el evento:', error);
    res.status(500).json({ message: 'Error al crear el evento', error });
  }
};

const editEvent = async (req, res) => {
  const { eventCode } = req.params;
  const {
    name,
    postalCode,
    time,
    status,
    cancelledInfo,
    startDate,
    endDate,
    organizationCode,
    multiDevice,
    image, 
    icon    
  } = req.body;

  if (!name && !postalCode && !time && !status && !cancelledInfo && !startDate && !endDate && !organizationCode) {
    return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
  }

  try {
    const event = await Event.findOne({ code: eventCode });
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    if (eventCode !== undefined) {
      const existingEvent = await Event.findOne({ code: eventCode });
      if (!existingEvent) {
        return res.status(400).json({ message: 'El código no existe en la base de datos.' });
      }
      event.code = eventCode;
    }

    if (name !== undefined) event.name = name;
    if (postalCode !== undefined) event.postalCode = postalCode;
    if (time !== undefined) event.time = time;
    if (status !== undefined) event.status = status;
    if (cancelledInfo !== undefined) event.cancelledInfo = cancelledInfo;
    if (startDate !== undefined) event.startDate = startDate;
    if (endDate !== undefined) event.endDate = endDate;
    if (organizationCode !== undefined) event.organizationCode = organizationCode;
    if (multiDevice !== undefined) event.multiDevice = multiDevice;
    if (image !== undefined) event.image = image;  
    if (icon !== undefined) event.icon = icon;     

    await event.save();

    res.status(200).json({ message: 'Evento actualizado exitosamente.', event });
  } catch (error) {
    if (error.code === 11000 && error.keyValue?.code) {
      return res.status(400).json({ message: 'El código del evento ya existe.' });
    }
    console.error('Error al actualizar el evento:', error);
    res.status(500).json({ message: 'Error al actualizar el evento', error });
  }
};

const changeStatusEvent = async (req, res) => {
  const { eventCode } = req.params;
  const { action, cancelledInfo } = req.body;

  if (action === undefined || cancelledInfo === undefined) {
    return res.status(400).json({ message: 'Faltan parámetros: action y cancelledInfo son obligatorios.' });
  }

  try {
    const event = await Event.findOne({code: eventCode});

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

const deleteEvent = async (req, res) => {
  const eventCode = req.params.eventCode;

  try {
    const event = await Event.findOneAndDelete({ code: eventCode });

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
  getEventById,
  getEventByCode,
  changeStatusEvent,
  createEvent, 
  editEvent, 
  deleteEvent
};