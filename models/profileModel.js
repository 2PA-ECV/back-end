const db = require('../config/database');
const { getOtherProfile } = require('../controllers/profileController');

const Profile = {
    getProfile: async (user_id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM profiles WHERE user_id = ?", [user_id], (err, result) => {
                if (err) reject(err);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },

    getOtherProfile: async (user_id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT users.username, profiles.profile_picture 
                 FROM users 
                 LEFT JOIN profiles ON users.user_id = profiles.user_id 
                 WHERE users.user_id = ?`,
                [user_id],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result.length > 0 ? result[0] : { username: null, profile_picture: null });
                }
            );
        });
    },
    

    createOrUpdateProfile : async (user_id, bio, interests, min_age_preference, max_age_preference, preferred_city, altura, lifestyle, preferences, profile_picture) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO profiles (user_id, bio, interests, min_age_preference, max_age_preference, preferred_city, altura, lifestyle, preferences, profile_picture)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    bio = VALUES(bio),
                    interests = VALUES(interests),
                    min_age_preference = VALUES(min_age_preference),
                    max_age_preference = VALUES(max_age_preference),
                    preferred_city = VALUES(preferred_city),
                    altura = VALUES(altura),
                    lifestyle = VALUES(lifestyle),
                    preferences = VALUES(preferences),
                    profile_picture = VALUES(profile_picture);
            `;
    
            db.query(
                query,
                [
                    user_id, 
                    bio, 
                    JSON.stringify(interests), 
                    min_age_preference, 
                    max_age_preference, 
                    preferred_city, 
                    altura, 
                    JSON.stringify(lifestyle), 
                    JSON.stringify(preferences), 
                    profile_picture
                ],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }
    
};

module.exports = Profile;
