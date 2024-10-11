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

module.exports = {
  getEvents,
  getEventById,
};
