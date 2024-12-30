const express = require('express');
const { getUsers, loginUser, registerUser, editUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', getUsers);

router.get('/login', loginUser);

router.post('/register', registerUser);

router.put('/:id', editUser);

router.delete('/:id', deleteUser);

module.exports = router;
