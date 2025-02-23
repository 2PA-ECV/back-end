const db = require('../config/database');

const User = {
    create: (userData, callback) => {
      const { name, username, email, password, birth_date, gender, city, profile_picture } = userData;
  
      db.query(
        'INSERT INTO users (name, username, email, password, birth_date, gender, city, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, username, email, password, birth_date, gender, city, profile_picture],
        callback
      );
    },
  
    findByEmail: (email, callback) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },
    
    findByUsernameOrEmail: (identifier, callback) => {
      db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [identifier, identifier],
        callback
      );
    },

    getNextUser: async (userId) => {
      return new Promise((resolve, reject) => {
          db.query(
              "SELECT id, name FROM users WHERE id != ? ORDER BY RAND() LIMIT 1",
              [userId],
              (err, result) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve(result.length > 0 ? result[0] : null);
                  }
              }
          );
      });
    }
  };
  
module.exports = User;
