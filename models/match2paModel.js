const db = require('../config/database');

exports.getMatches2paByUserId = async (userId) => {
    const query = `
        SELECT * FROM matches_2pa
        WHERE user_id_1 = ? OR user_id_2 = ? OR friend_1_id = ? OR friend_2_id = ?
    `;
    const values = [userId, userId, userId, userId];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

exports.getMatch2paById = async (match2paId) => {
    const query = `
        SELECT * FROM matches_2pa
        WHERE match_id = ?
    `;
    const values = [match2paId];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};