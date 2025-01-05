const RawLocation = require('../model/rawLocation');
const Location = require('../model/location');

// Insertar ubicación sin procesar
const insertRawLocation = async (req, res) => {
  const { location } = req.body;

  try {
    console.log("Nueva ubicación recibida:", location);

    const lastRawLocation = await RawLocation.findOne({ code: location.code }).sort({ timestamp: -1 });
    console.log("Última ubicación sin procesar encontrada:", lastRawLocation);

    const newRawLocation = new RawLocation({ ...location, reason: null });
    await newRawLocation.save();
    console.log("Ubicación insertada en RawLocation:", newRawLocation);

    if (location.accuracy > 30) {
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

    if (
      !lastRawLocation ||
      lastRawLocation.latitude !== location.latitude ||
      lastRawLocation.longitude !== location.longitude
    ) {
      const newLocation = new Location({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: location.timestamp,
        code: location.code,
      });

      await newLocation.save();
      console.log("Ubicación insertada en Location:", newLocation);

      newRawLocation.processed = true;
      await newRawLocation.save();

      return res.status(201).json({
        success: true,
        message: "Ubicación procesada e insertada correctamente en ambas tablas.",
        rawLocation: newRawLocation,
        location: newLocation,
      });
    } else {
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

    if (!rawLocations.length) {
      return res.status(404).json({ message: "No se encontraron ubicaciones para este evento." });
    }

    res.status(200).json(rawLocations);
  } catch (error) {
    console.error("Error al recuperar ubicaciones por código de evento:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

module.exports = {
  insertRawLocation,
  getRawLocationsByEventCode,
};
