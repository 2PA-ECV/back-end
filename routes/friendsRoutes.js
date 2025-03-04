const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para enviar una solicitud de amistad
router.post('/send-request', authMiddleware, friendsController.sendFriendRequest);

// Ruta para aceptar una solicitud de amistad
router.post('/accept-request', authMiddleware, friendsController.acceptFriendRequest);

// Ruta para obtener las solicitudes de amistad pendientes
router.get('/pending-requests', authMiddleware, friendsController.getPendingRequests);

// Ruta para buscar a un amigo por su hashtag 
router.get('/search', authMiddleware, friendsController.searchFriend);

module.exports = router;
