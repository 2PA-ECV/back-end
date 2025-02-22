const db = require("../config/database");

const Profile = {
    getProfile: async (user_id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM profiles WHERE user_id = ?", [user_id], (err, result) => {
                if (err) reject(err);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },

    createOrUpdateProfile: async (user_id, bio, interests, min_age_preference, max_age_preference, preferred_city) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO profiles (user_id, bio, interests, min_age_preference, max_age_preference, preferred_city)
                VALUES (?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE bio=VALUES(bio), interests=VALUES(interests),
                min_age_preference=VALUES(min_age_preference), max_age_preference=VALUES(max_age_preference),
                preferred_city=VALUES(preferred_city)`,
                [user_id, bio, interests, min_age_preference, max_age_preference, preferred_city],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }
};

module.exports = Profile;
