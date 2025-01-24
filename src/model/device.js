const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceID: { type: String, required: true }, // Ya no es único globalmente
  eventCode: { type: Number, required: true }, // Asociado al evento
  name: { type: String, required: true }, // Nombre del dispositivo
  order: { type: Number, required: false }, // Orden dentro del evento
  color: { type: String, required: false, default: '#000000' }, // Color para visualización
  icon: { type: String, default: '' },
});

// Índice único para la combinación de deviceID y eventCode
deviceSchema.index({ deviceID: 1, eventCode: 1 }, { unique: true });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
