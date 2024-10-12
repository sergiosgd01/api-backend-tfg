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

const changeStatusEvent = async (req, res) => {
  const { code } = req.params;
  const { action, cancelledInfo } = req.body;

  if (action === undefined || cancelledInfo === undefined) {
    return res.status(400).json({ message: 'Faltan parámetros: action y cancelledInfo son obligatorios.' });
  }

  try {
    const event = await Event.findOne({ code: Number(code) });

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
      res.status(200).json({ event: event });
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
  getEventQRCode,
};
