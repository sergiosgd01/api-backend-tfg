const RawLocation = require('../model/rawLocation');
const Location = require('../model/location');

const insertRawLocation = async (req, res) => {
  const { location } = req.body;

  try {
    console.log("Nueva ubicación recibida:", location);

    // Busca la última ubicación sin procesar en RawLocation
    const lastRawLocation = await RawLocation.findOne({ code: location.code }).sort({ timestamp: -1 });
    console.log("Última ubicación sin procesar encontrada:", lastRawLocation);

    // Inserta siempre la nueva ubicación en RawLocation
    const newRawLocation = new RawLocation({ ...location, reason: null });
    await newRawLocation.save();
    console.log("Ubicación insertada en RawLocation:", newRawLocation);

    // Verifica si la precisión es válida
    if (location.accuracy > 30) {
      console.log("Ubicación no válida debido a precisión alta.");

      // Actualiza el campo `reason` y `errorCode` en RawLocation
      newRawLocation.reason = "La ubicación no es precisa.";
      newRawLocation.errorCode = 2; // Baja precisión
      newRawLocation.processed = true;
      await newRawLocation.save();

      return res.status(201).json({
        success: true,
        message: "Ubicación insertada en RawLocation, pero no en Location debido a precisión alta.",
        rawLocation: newRawLocation,
      });
    }

    // Verifica si la ubicación es válida para insertar en Location
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
        code: location.code,
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

module.exports = {
  insertRawLocation,
};
