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
    }
  };
  
module.exports = User;
