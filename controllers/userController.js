const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/userModel');

// Registrar un nuevo usuario con rol
exports.registerUser = [
    // Validar datos de entrada
    check('fullName', 'El nombre completo es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio y debe ser válido').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { fullName, email, password, role } = req.body;

            // Verificar si el usuario ya existe
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear el nuevo usuario
            const newUser = await User.create({
                fullName,
                email,
                password: hashedPassword,
                role: role || 'user' // Asigna 'user' como rol por defecto
            });

            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el usuario', error });
        }
    }
];

// Iniciar sesión de un usuario
exports.loginUser = [
    // Validar datos de entrada
    check('email', 'El correo es obligatorio y debe ser válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            // Verificar si el usuario existe
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: 'Credenciales incorrectas' });
            }

            // Verificar la contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Credenciales incorrectas' });
            }

            // Generar un token JWT
            const token = user.generateAuthToken();

            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error al iniciar sesión', error });
        }
    }
];

// Obtener usuarios o un usuario por ID
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.status(200).json(user);
        } else {
            const users = await User.findAll();
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Actualizar un usuario por ID
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar los datos del usuario
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

// Eliminar un usuario por ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.destroy();
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};

