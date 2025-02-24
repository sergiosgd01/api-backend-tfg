const User = require('../model/user')
const jwt = require('jsonwebtoken'); // Instala jsonwebtoken con npm install jsonwebtoken
const bcrypt = require('bcrypt'); // Instala bcrypt con npm install bcrypt

const getCurrentUser = async (req, res) => {
  try {
    // El middleware de autenticación ya ha verificado el token y agregado el usuario al objeto `req`
    const user = await User.findById(req.user.userId).select('-password'); // Excluye la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id }); 

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body; // Recibe los datos del cuerpo de la solicitud
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    // Verifica la contraseña cifrada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    // Genera un token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Datos que quieres incluir en el token
      process.env.JWT_SECRET, // Clave secreta para firmar el token
      { expiresIn: '2h' } // Tiempo de expiración del token
    );
    // Devuelve el token y los datos del usuario
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username, // Usa el campo "username" en lugar de "name"
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Ocurrió un error al buscar el usuario' });
  }
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verifica si el correo electrónico ya está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    // Cifra la contraseña antes de guardarla
    const saltRounds = 10; // Número de rondas de cifrado
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crea un nuevo usuario con la contraseña cifrada
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Guarda la contraseña cifrada
      admin: 0,
    });

    await newUser.save();

    // Genera un token JWT para el nuevo usuario
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email }, // Datos que quieres incluir en el token
      process.env.JWT_SECRET, // Clave secreta para firmar el token
      { expiresIn: '2h' } // Tiempo de expiración del token
    );

    // Devuelve el token y los datos del usuario
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Ocurrió un error al registrar el usuario' });
  }
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, admin } = req.body;

  try {
    // Busca el usuario por ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualiza solo los campos proporcionados en la solicitud
    if (username !== undefined) {
      user.username = username;
    }
    if (email !== undefined) {
      user.email = email;
    }
    if (password !== undefined) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds); // Cifra la nueva contraseña
    }
    if (admin !== undefined) {
      user.admin = admin;
    }

    // Guarda los cambios
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado exitosamente.', user });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message || error });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);

    if (user) {
      res.status(200).json({ message: 'El usuario fue eliminado correctamente.', user });
    } else {
      res.status(404).json({ message: 'No se encontró el usuario.' });
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  getCurrentUser,
  getUsers,
  getUserById,
  loginUser,
  registerUser,
  editUser,
  deleteUser,
};