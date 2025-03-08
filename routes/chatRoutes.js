const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');


// Ruta para enviar un mensaje
router.post('/', authMiddleware, chatController.addMessage);

// Ruta para obtener mensajes de un match
router.get('/:matchId', authMiddleware, chatController.getMessages);

module.exports = router;