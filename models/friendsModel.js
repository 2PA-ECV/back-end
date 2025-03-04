const db = require('../config/database');

const Friend = {
    // Enviar solicitud de amistad
    sendFriendRequest: (userId, targetUserId) => {
        return new Promise((resolve, reject) => {
            // Comprobamos si ya existe una solicitud entre los dos usuarios
            db.query(
                "SELECT * FROM friends WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)",
                [userId, targetUserId, targetUserId, userId],
                (err, result) => {
                    if (err) reject(err);
                    if (result.length > 0) {
                        resolve({ error: 'Ya existe una solicitud o amistad.' });
                    } else {
                        // Si no existe solicitud, crear una nueva solicitud
                        db.query(
                            "INSERT INTO friends (user_id_1, user_id_2, status, date) VALUES (?, ?, 'pendiente', NOW())",
                            [userId, targetUserId],
                            (err, result) => {
                                if (err) reject(err);
                                resolve({ message: 'Solicitud de amistad enviada.' });
                            }
                        );
                    }
                }
            );
        });
    },

    // Aceptar solicitud de amistad
    acceptFriendRequest: (userId, friendshipId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE friends SET status = 'aceptado' WHERE friendship_id = ? AND (user_id_1 = ? OR user_id_2 = ?)",
                [friendshipId, userId, userId],
                (err, result) => {
                    if (err) reject(err);
                    resolve({ message: 'Solicitud de amistad aceptada.' });
                }
            );
        });
    },

    // Verificar si ya son amigos
    checkIfFriends: (userId, targetUserId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM friends WHERE ((user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)) AND status = 'aceptado'",
                [userId, targetUserId, targetUserId, userId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result.length > 0);
                }
            );
        });
    },

    // Obtener solicitudes pendientes
    getPendingRequests: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM friends WHERE (user_id_1 = ? OR user_id_2 = ?) AND status = 'pendiente'",
                [userId, userId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    },

    // Buscar usuarios por hashtag (en este caso, por nombre o email, como ejemplo)
    searchFriendByHashtag: (hashtag) => {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM users WHERE CONCAT('#', username) = ?",
                [hashtag],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result.length > 0 ? result[0] : null);
                }
            );
        });
    }

    // Rechazar solicitud de amistad
    rejectFriendRequest: (userId, friendshipId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM friends WHERE friendship_id = ? AND (user_id_1 = ? OR user_id_2 = ?)",
                [friendshipId, userId, userId],
                (err, result) => {
                    if (err) reject(err);
                    resolve({ message: 'Solicitud de amistad rechazada.' });
                }
            );
        });
    }

};

module.exports = Friend;
