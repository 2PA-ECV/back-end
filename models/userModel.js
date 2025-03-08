const db = require('../config/database');

const User = {
    create: (userData, callback) => {
      const { name, username, email, password, dob, gender, city, user_tag } = userData;
  
      db.query(
        'INSERT INTO users (name, username, email, password, birth_date, gender, city, user_tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, username, email, password, dob, gender, city, user_tag],
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
          // Primero, obtenemos el género y la preferencia sexual del usuario actual
          db.query(
              `SELECT u.gender, p.preference_sexual 
               FROM users u
               LEFT JOIN profiles p ON u.user_id = p.user_id
               WHERE u.user_id = ?`,
              [userId],
              (err, result) => {
                  if (err) {
                      reject(err);
                      return;
                  }
  
                  if (result.length === 0) {
                      resolve(null); // Si no se encuentra el perfil del usuario
                      return;
                  }
  
                  const userGender = result[0].gender;
                  const userSexualPreference = result[0].preference_sexual;
  
                  let genderFilter = "";
  
                  if (userSexualPreference === 'heterosexual') {
                      genderFilter = userGender === 'masculino' ? "p.gender = 'femenino'" : "p.gender = 'masculino'";
                  } else if (userSexualPreference === 'homosexual') {
                      genderFilter = userGender === 'masculino' ? "p.gender = 'masculino'" : "p.gender = 'femenino'";
                  } else if (userSexualPreference === 'bisexual') {
                      genderFilter = "p.gender IN ('masculino', 'femenino')";
                  }
  
                  db.query(
                      `SELECT u.user_id, u.name, 
                              TIMESTAMPDIFF(YEAR, u.birth_date, CURDATE()) AS age, 
                              p.bio
                      FROM users u
                      LEFT JOIN profiles p ON u.user_id = p.user_id
                      WHERE u.user_id != ? 
                      AND ${genderFilter} 
                      ORDER BY RAND() 
                      LIMIT 1`,
                      [userId],
                      (err, result) => {
                          if (err) {
                              reject(err);
                          } else {
                              resolve(result.length > 0 ? result[0] : null);
                          }
                      }
                  );
              }
          );
      });
  },
  
  

    getUser: async (userId) => {
      return new Promise((resolve, reject) => {
          db.query(
              "SELECT * FROM users WHERE user_id = ?",
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


