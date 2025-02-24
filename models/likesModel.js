const db = require('../config/database'); // Asegúrate de tener configurada tu conexión a la base de datos

exports.saveLikeDislike = async (userId, likedUserId, action) => {
    const query = `
        INSERT INTO likes (user_id, liked_user_id, action, date)
        VALUES (?, ?, ?, NOW())
    `;
    const values = [userId, likedUserId, action];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve({ like_id: results.insertId, user_id: userId, liked_user_id: likedUserId, action });
        });
    });
};

exports.getLike = async (userId, likedUserId) => {
    const query = `
        SELECT * FROM likes 
        WHERE user_id = ? AND liked_user_id = ?
    `;
    const values = [userId, likedUserId];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.length > 0 ? results[0] : null); // Retorna el primer resultado si existe
        });
    });
};
