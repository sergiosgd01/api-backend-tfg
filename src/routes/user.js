const express = require('express');
const { 
  getCurrentUser,
  getUsers, 
  getUserById, 
  loginUser, 
  registerUser, 
  editUser, 
  deleteUser 
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', authenticateToken, getCurrentUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

router.put('/:id', editUser);

router.post('/login', loginUser);
router.post('/', registerUser);

router.delete('/:id', deleteUser);

module.exports = router;
