const db = require('../config/database');

exports.createDoubleMatch = async (user1a, user1b, user2a, user2b) => {
    const query = `
        INSERT INTO matches_2pa (user_1a, user_1b, user_2a, user_2b, date)
        VALUES (?, ?, ?, ?, NOW())
    `;
    const values = [user1a, user1b, user2a, user2b];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve({ match_2pa_id: results.insertId, users: [user1a, user1b, user2a, user2b] });
        });
    });
};
