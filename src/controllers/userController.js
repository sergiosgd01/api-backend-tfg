const User = require('../model/user')
const jwt = require('jsonwebtoken'); // Instala jsonwebtoken con npm install jsonwebtoken
const bcrypt = require('bcrypt'); // Instala bcrypt con npm install bcrypt

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
  const { email, password } = req.body; // Cambia a req.body para recibir los datos del cuerpo de la solicitud
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
      { expiresIn: '1h' } // Tiempo de expiración del token
    );

    // Devuelve el token y los datos del usuario
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
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

const editUser = async (req, res) => {
  const { id } = req.params; 
  const { 
    username, 
    email, 
    password,
    admin
  } = req.body;

  // Verifica que todos los campos estén presentes
  if (
    username === undefined || 
    email === undefined || 
    password === undefined || 
    admin === undefined
  ) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar el usuario.' });
  }

  try {
    // Busca el usuario por ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualiza los valores del usuario
    user.username = username;
    user.email = email;
    user.password = password;
    user.admin = admin;

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
  getUsers,
  getUserById,
  loginUser,
  registerUser,
  editUser,
  deleteUser,
};