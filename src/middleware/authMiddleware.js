const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del encabezado "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId }; // Adjunta el ID del usuario al objeto `req`
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authenticateToken;