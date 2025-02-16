const db = require('../config/database');

const Profile = {
  getProfile: (user_id, callback) => {
    db.query('SELECT * FROM profiles WHERE user_id = ?', [user_id], callback);
  },

  createOrUpdateProfile: (user_id, bio, interests, min_age_preference, max_age_preference, preferred_city, callback) => {
    db.query(
      `INSERT INTO profiles (user_id, bio, interests, min_age_preference, max_age_preference, preferred_city)
      VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE bio=VALUES(bio), interests=VALUES(interests),
      min_age_preference=VALUES(min_age_preference), max_age_preference=VALUES(max_age_preference),
      preferred_city=VALUES(preferred_city)`,
      [user_id, bio, interests, min_age_preference, max_age_preference, preferred_city],
      callback
    );
  }
};

module.exports = Profile;
