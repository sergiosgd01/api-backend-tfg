const users = require('../data/users.json');  

// Obtener todos los usuarios
const getUsers = (req, res) => {
  res.status(200).json(users);  
};

const loginUser = (req, res) => {
  const { email, password } = req.query;

  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    res.status(200).json({ success: true, usuario: user });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }
};

const registerUser = (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = users.find(user => user.email === email);

    if (userExists) {
      return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    const newUser = { username, email, password };
    users.push(newUser);

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ocurrió un error al registrar el usuario' });
  }
};

module.exports = {
  getUsers,
  loginUser,
  registerUser,
};