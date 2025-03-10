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

    getPhotoById: async (id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT photo_id, photo_url FROM photos WHERE photo_id = ?", [id], (err, result) => {
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

    addProfilePhoto: async (userId, photoUrl) => {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE profiles SET profile_picture = ? WHERE user_id = ?",
                [photoUrl, userId],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },
    

    deletePhoto: async (photoUrl) => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM photos WHERE photo_url = ?", [photoUrl], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = Photo;