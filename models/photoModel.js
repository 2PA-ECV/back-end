const db = require("../config/database");

const Photo = {
    getPhotosByUserId: async (userId) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT photo_id, photo_url FROM photos WHERE user_id = ?", [userId], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    addPhoto: async (userId, photoUrl) => {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO photos (user_id, photo_url) VALUES (?, ?)", [userId, photoUrl], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    deletePhoto: async (userId, photoId) => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM photos WHERE photo_id = ? AND user_id = ?", [photoId, userId], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = Photo;