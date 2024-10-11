const User = require('../model/user')

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.query;

  try {
    const user = await User.findOne({ email, password });
    
    if (user) {
      return res.status(200).json({ success: true, usuario: user });
    }

    res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ocurrió un error al buscar el usuario' });
  }
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    const newUser = new User({ username, email, password, admin: 0 });
    await newUser.save();

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ocurrió un error al registrar el usuario' });
  }
};

module.exports = {
  getUsers,
  loginUser,
  registerUser,
};