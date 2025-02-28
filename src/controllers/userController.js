const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('adminOf');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        isSuperAdmin: user.isSuperAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        adminOf: user.adminOf
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
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isSuperAdmin: false,
      adminOf: []
    });

    await newUser.save();

    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email,
        isSuperAdmin: newUser.isSuperAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isSuperAdmin: newUser.isSuperAdmin,
        adminOf: []
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Ocurrió un error al registrar el usuario' });
  }
};

const addUser = async (req, res) => {
  const { username, email, password, isSuperAdmin, adminOf } = req.body;

  try {
    // Buscar el usuario que está haciendo la petición
    const requestingUser = await User.findById(req.user.userId);
    if (!requestingUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar que quien crea el usuario es superAdmin
    if (!requestingUser.isSuperAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Solo los superadministradores pueden crear usuarios con privilegios' 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isSuperAdmin: isSuperAdmin || false,
      adminOf: adminOf || []
    });

    await newUser.save();
    await newUser.populate('adminOf');

    return res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isSuperAdmin: newUser.isSuperAdmin,
        adminOf: newUser.adminOf
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Ocurrió un error al crear el usuario' });
  }
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, isSuperAdmin, adminOf } = req.body;

  try {
    // Buscar el usuario que está haciendo la petición
    const requestingUser = await User.findById(req.user.userId);
    if (!requestingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Verificar que quien edita el usuario es superAdmin
    if (!requestingUser.isSuperAdmin) {
      return res.status(403).json({ 
        message: 'Solo los superadministradores pueden editar usuarios con privilegios.' 
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Verificar si el email ya existe y pertenece a otro usuario
    if (email !== undefined && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: 'El email ya está en uso por otro usuario.' });
      }
    }

    // Campos que cualquier usuario puede editar de sí mismo
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (password !== undefined) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // Campos que solo puede editar un superAdmin
    if (isSuperAdmin !== undefined) {
      user.isSuperAdmin = isSuperAdmin;
    }
    if (adminOf !== undefined) {
      user.adminOf = adminOf;
    }

    await user.save();
    await user.populate('adminOf');
    
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ 
      message: 'Usuario actualizado exitosamente.',
      user: userResponse
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ 
      message: 'Error al actualizar el usuario', 
      error: error.message || error 
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('adminOf');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      adminOf: user.adminOf
    });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate('adminOf');
    
    const usersResponse = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      adminOf: user.adminOf
    }));

    res.status(200).json(usersResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id })
      .select('-password')
      .populate('adminOf');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      adminOf: user.adminOf
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el usuario que está haciendo la petición
    const requestingUser = await User.findById(req.user.userId);
    if (!requestingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Solo superAdmin puede eliminar usuarios
    if (!requestingUser.isSuperAdmin) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este usuario.' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};

module.exports = {
  getCurrentUser,
  getUsers,
  getUserById,
  loginUser,
  registerUser,
  addUser,
  editUser,
  deleteUser
};