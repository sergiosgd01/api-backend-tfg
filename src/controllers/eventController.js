const events = require('../data/events.json'); 

// Función para obtener todos los eventos
const getEvents = (req, res) => {
  res.status(200).json(events);
};

// Función para obtener un evento por code
const getEventById = (req, res) => {
  const { code } = req.params; 
  const event = events.find(event => event.code === Number(code)); 

  if (event) {
    res.status(200).json(event); 
  } else {
    res.status(404).json({ message: 'Evento no encontrado.' }); 
  }
};

module.exports = {
  getEvents,
  getEventById,
};