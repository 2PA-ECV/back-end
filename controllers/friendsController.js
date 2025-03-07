const Friend = require('../models/friendsModel');
const User = require('../models/userModel');

// Enviar solicitud de amistad
exports.sendFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const targetUserId = req.body.targetUserId;        
        // Verificar si ya son amigos o si la solicitud ya fue enviada
        const alreadyFriends = await Friend.checkIfFriends(userId, targetUserId);
        if (alreadyFriends) {
            return res.status(400).json({ error: 'Ya son amigos.' });
        }

        const requestSent = await Friend.sendFriendRequest(userId, targetUserId);

        if (requestSent) {
            return res.status(200).json({ message: 'Solicitud de amistad enviada.' });
        } else {
            return res.status(500).json({ error: 'Error al enviar la solicitud del model. ' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar la solicitud de amistad.' });
    }
};

// Aceptar solicitud de amistad
exports.acceptFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const targetUserId = req.body.targetUserId;        

        const accepted = await Friend.acceptFriendRequest(userId, targetUserId);
        if (accepted) {
            return res.status(200).json({ message: 'Solicitud de amistad aceptada.' });
        } else {
            return res.status(500).json({ error: 'Error al aceptar la solicitud.' });
        }
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las solicitudes pendientes.' });
    }
};

// Buscar un amigo por su user_tag
exports.searchFriend = async (req, res) => {
    try {
        const user_tag = req.params.userTag; 
        console.log("El user tag es:", user_tag);        
        const user = await Friend.searchFriendByHashtag(user_tag); 
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el usuario.' });
    }
};

// Rechazar solicitud de amistad
exports.rejectFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const targetUserId = req.body.targetUserId;        

        const rejected = await Friend.rejectFriendRequest(userId, targetUserId);
        if (rejected) {
            return res.status(200).json({ message: 'Solicitud de amistad rechazada.' });
        } else {
            return res.status(500).json({ error: 'Error al rechazar la solicitud.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al rechazar la solicitud.' });
    }
};

exports.deleteFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const targetUserId = req.body.targetUserId;        

        const rejected = await Friend.rejectFriend(userId, targetUserId);
        if (rejected) {
            return res.status(200).json({ message: 'Amigo rechazado.' });
        } else {
            return res.status(500).json({ error: 'Error al rechazar amigo.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al rechazar amigo.' });
    }
};

exports.getFriends = async (req, res) => {
    try {
        const userId = req.user.id;
        const friends = await Friend.getFriends(userId);
        res.json(friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los amigos.' });
    }
};


