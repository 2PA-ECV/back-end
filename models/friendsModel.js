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
                            "INSERT INTO friends (user_id_1, user_id_2, status, date) VALUES (?, ?, 'pending', NOW())",
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
    acceptFriendRequest: (userId, targetUserId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE friends SET status = 'confirmed' WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)",
                [userId, targetUserId, targetUserId, userId], // Uso de variables correctas
                (err, result) => {
                    if (err) reject(err);
                    resolve({ message: 'Solicitud de amistad aceptada.' });
                }
            );
        });
    },

    // Rechazar solicitud de amistad
    rejectFriendRequest: (userId, targetUserId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE friends SET status = 'declined' WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)",
                [userId, targetUserId, targetUserId, userId], // Uso de variables correctas
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
                "SELECT * FROM friends WHERE ((user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)) AND status = 'confirmed'",
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
                "SELECT * FROM friends WHERE (user_id_1 = ? OR user_id_2 = ?) AND status = 'pending'",
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
                "SELECT * FROM users WHERE user_tag = ?",
                [hashtag],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result.length > 0 ? result[0] : null);
                }
            );
        });
    },
    

    // Eliminar amistad
    rejectFriend: (userId, targetUserId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM friends WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)",
                [userId, targetUserId, targetUserId, userId], 
                (err, result) => {
                    if (err) reject(err);
                    resolve({ message: 'Amistad eliminada correctamente.' });
                }
            );
        });
    },

    getFriends: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM friends WHERE (user_id_1 = ? OR user_id_2 = ?) AND status = 'confirmed'",
                [userId, userId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }


};

module.exports = Friend;
