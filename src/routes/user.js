const express = require('express');
const { getUsers, getUserById, loginUser, registerUser, editUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', getUsers);

router.get('/:id', getUserById);

router.get('/login', loginUser);

router.post('/register', registerUser);

router.put('/:id', editUser);

router.delete('/:id', deleteUser);

module.exports = router;
