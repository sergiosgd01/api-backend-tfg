const express = require('express');
const { 
  getCurrentUser,
  getUsers, 
  getUserById, 
  loginUser, 
  registerUser, 
  addUser,
  editUser, 
  deleteUser 
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Rutas públicas
router.post('/login', loginUser);
router.post('/register', registerUser); // Registro público normal

// Rutas protegidas que requieren autenticación
router.post('/add', authenticateToken, addUser); // Nueva ruta para crear usuarios con privilegios
router.get('/me', authenticateToken, getCurrentUser);
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, editUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;