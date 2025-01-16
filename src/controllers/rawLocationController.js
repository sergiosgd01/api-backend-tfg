const RawLocation = require('../model/rawLocation');
const Location = require('../model/location');

// Insertar ubicación sin procesar
const insertRawLocation = async (req, res) => {
  const { location, code, deviceID } = req.body; // Ahora incluimos deviceID en el cuerpo de la solicitud

  try {
    console.log("Nueva ubicación recibida:", location);

    // Verifica primero si la precisión es válida
    if (location.accuracy > 30) {
      console.log("Ubicación no válida debido a precisión alta.");

      // Inserta directamente en RawLocation con el error correspondiente
      const newRawLocation = new RawLocation({
        ...location,
        code,
        deviceID, // Agregamos el campo deviceID
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
    const lastRawLocation = await RawLocation.findOne({ code, deviceID }).sort({ timestamp: -1 });
    console.log("Última ubicación sin procesar encontrada:", lastRawLocation);

    // Inserta la nueva ubicación en RawLocation
    const newRawLocation = new RawLocation({ ...location, code, deviceID, reason: null });
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
        deviceID, // Agregamos el campo deviceID
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
