const Friend = require('../models/friendModel');
const User = require('../models/userModel');

// Enviar solicitud de amistad
exports.sendFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.body;

        // Verificar si ya son amigos o si la solicitud ya fue enviada
        const alreadyFriends = await Friend.checkIfFriends(userId, targetUserId);
        if (alreadyFriends) {
            return res.status(400).json({ error: 'Ya son amigos.' });
        }

        const requestSent = await Friend.sendFriendRequest(userId, targetUserId);
        if (requestSent) {
            return res.status(200).json({ message: 'Solicitud de amistad enviada.' });
        } else {
            return res.status(500).json({ error: 'Error al enviar la solicitud.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar la solicitud de amistad.' });
    }
};

// Aceptar solicitud de amistad
exports.acceptFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { requestId } = req.body;

        const accepted = await Friend.acceptFriendRequest(userId, requestId);
        if (accepted) {
            return res.status(200).json({ message: 'Solicitud de amistad aceptada.' });
        } else {
            return res.status(500).json({ error: 'Error al aceptar la solicitud.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al aceptar la solicitud.' });
    }
};

// Obtener solicitudes pendientes
exports.getPendingRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const pendingRequests = await Friend.getPendingRequests(userId);
        res.json(pendingRequests);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las solicitudes pendientes.' });
    }
};

// Buscar un amigo por su hashtag
exports.searchFriend = async (req, res) => {
    try {
        const { hashtag } = req.query;
        const user = await User.findByHashtag(hashtag);
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el usuario.' });
    }
};
