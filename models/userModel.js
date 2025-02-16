const db = require('../config/database');

const User = {
  create: (name, email, password, birth_date, gender, city, profile_picture, callback) => {
    db.query(
      'INSERT INTO users (name, email, password, birth_date, gender, city, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, birth_date, gender, city, profile_picture],
      callback
    );
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  }
};

module.exports = User;
