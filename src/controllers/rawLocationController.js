const RawLocation = require('../model/rawLocation');
const Location = require('../model/location');
const EventControl = require('../model/eventControl');
const Event = require('../model/event');

const insertRawLocation = async (req, res) => {
  const { location, code } = req.body;
  let { deviceID } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'El código del evento es obligatorio.' });
  }

  try {
    // Verificar si el evento existe y si es multiDevice
    const event = await Event.findOne({ code });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }
    
    // Si es multiDevice, deviceID es requerido
    if (event.multiDevice && !deviceID) {
      return res.status(400).json({ 
        message: 'Se requiere deviceID para eventos con múltiples dispositivos.' 
      });
    }
    
    // Para eventos no multiDevice, deviceID debe ser null
    if (!event.multiDevice) {
      deviceID = null;
    }

    console.log("Nueva ubicación recibida:", location);

    // Obtener la configuración del evento para determinar el valor de accuracy permitido
    const eventControl = await EventControl.findOne({ eventCode: code });

    const allowedAccuracy = eventControl ? eventControl.accuracy : 30;

    // Verifica primero si la precisión es válida
    if (location.accuracy > allowedAccuracy) {
      console.log(`Ubicación no válida debido a precisión alta. Permitida: ${allowedAccuracy}`);

      // Inserta directamente en RawLocation con el error correspondiente
      const newRawLocation = new RawLocation({
        ...location,
        code,
        deviceID: event.multiDevice ? deviceID : null,
        reason: "La ubicación no es precisa.",
        errorCode: 2, // Baja precisión
        processed: true,
      });
      await newRawLocation.save();

      return res.status(201).json({
        success: true,
        message: "Ubicación insertada en RawLocation, pero no en Location debido a precisión alta.",
        rawLocation: newRawLocation,
      });
    }

    // Busca la última ubicación antes de insertar la nueva
    // Ajustar la consulta según si es multiDevice o no
    const query = event.multiDevice ? { code, deviceID } : { code };
    const lastRawLocation = await RawLocation.findOne(query).sort({ timestamp: -1 });
    console.log("Última ubicación sin procesar encontrada:", lastRawLocation);

    // Inserta la nueva ubicación en RawLocation
    const newRawLocation = new RawLocation({ 
      ...location, 
      code, 
      deviceID: event.multiDevice ? deviceID : null, 
      reason: null 
    });
    await newRawLocation.save();

    // Verifica si la nueva ubicación es válida para insertar en Location
    if (
      !lastRawLocation || // No hay ninguna ubicación en RawLocation aún
      lastRawLocation.latitude !== location.latitude || // Coordenada diferente
      lastRawLocation.longitude !== location.longitude // Coordenada diferente
    ) {
      console.log("Ubicación válida para insertar en Location.");

      // Si es válida, insértala en Location
      const newLocation = new Location({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: location.timestamp,
        code,
        deviceID: event.multiDevice ? deviceID : null,
      });

      await newLocation.save();
      console.log("Ubicación insertada en Location:", newLocation);

      // Marca la ubicación en RawLocation como procesada
      newRawLocation.processed = true;
      await newRawLocation.save();

      return res.status(201).json({
        success: true,
        message: "Ubicación procesada e insertada correctamente en ambas tablas.",
        rawLocation: newRawLocation,
        location: newLocation,
      });
    } else {
      console.log("Ubicación no válida para insertar en Location. Es igual a la última sin procesar.");

      // Si no es válida, actualiza el campo `reason` y `errorCode` en RawLocation
      newRawLocation.reason = "Ubicación igual a la última sin procesar.";
      newRawLocation.errorCode = 1; // Igual a la anterior
      newRawLocation.processed = true;
      await newRawLocation.save();

      return res.status(201).json({
        success: true,
        message: "Ubicación insertada en RawLocation, pero no en Location debido a que es igual a la última sin procesar.",
        rawLocation: newRawLocation,
      });
    }
  } catch (error) {
    console.error("Error al insertar la ubicación sin procesar:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Obtener ubicaciones de un evento por código
const getRawLocationsByEventCode = async (req, res) => {
  const { code } = req.params;

  try {
    console.log("Recuperando ubicaciones para el evento con código:", code);

    const rawLocations = await RawLocation.find({ code }).sort({ timestamp: -1 });

    // En lugar de devolver un 404, devolvemos un array vacío con un 200
    res.status(200).json(rawLocations);
  } catch (error) {
    console.error("Error al recuperar ubicaciones por código de evento:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Eliminar todas las ubicaciones sin procesar de un evento por código
const deleteRawLocationsByEventCode = async (req, res) => {
  const { code } = req.params;

  try {
    console.log(`Eliminando ubicaciones para el evento con código: ${code}`);

    const result = await RawLocation.deleteMany({ code });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "No se encontraron ubicaciones para este evento.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} ubicaciones del evento con código: ${code}.`,
    });
  } catch (error) {
    console.error("Error al eliminar ubicaciones por código de evento:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

module.exports = {
  insertRawLocation,
  getRawLocationsByEventCode,
  deleteRawLocationsByEventCode,
};
