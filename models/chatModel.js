const db = require("../config/database");

const Chat = {  
    // Guardar mensaje en la base de datos
    addMessage: async (match_id, sender_id, message) => {
        return new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO messages (match_id, sender_user_id, message, date) VALUES (?, ?, ?, NOW())",
                [match_id, sender_id, message],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    },

    // Obtener mensajes de un match
    getMessages: async (match_id) => {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT sender_user_id AS senderId, message, date FROM messages WHERE match_id = ? ORDER BY date ASC",
                [match_id],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }
};

module.exports = Chat;
