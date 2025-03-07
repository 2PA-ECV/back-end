const db = require("../config/database");

const Chat = {  
    addmessage: async (match_id, sender_id, message) => {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO messages (match_id, sender_user_id, message) VALUES (?, ?, ?)", [match_id, sender_id, message], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    getMessages: async (match_id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM messages WHERE match", [sender_id, receiver_id, receiver_id, sender_id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

};