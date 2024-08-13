const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, admin } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rutas protegidas
router.get('/:id?', auth, userController.getUser);
router.put('/:id', auth, userController.updateUser);

// Rutas solo para administradores
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router;