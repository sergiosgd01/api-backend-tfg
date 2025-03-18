const ping = (req, res) => {
  try {
    res.status(200).json({
      message: 'pong',
      timestamp: new Date().toISOString(),
      status: 'ok'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

module.exports = {
  ping
};