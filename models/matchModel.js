const db = require('../config/database');

exports.createMatch = async (userId1, userId2) => {
    const query = `
        INSERT INTO matches (user_id_1, user_id_2)
        VALUES (?, ?)
    `;
    const values = [userId1, userId2];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve({ match_id: results.insertId, user_id_1: userId1, user_id_2: userId2 });
        });
    });
};

exports.getMatchesByUserId = async (userId) => {
    const query = `
        SELECT * FROM matches
        WHERE user_id_1 = ? OR user_id_2 = ?
    `;
    const values = [userId, userId];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

exports.getMatchById = async (matchId) => {        
    const query = `
        SELECT * FROM matches
        WHERE match_id = ?
    `;
    const values = [matchId];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}