const db = require('../config/database');

exports.createMatch = async (userId1, userId2) => {
    // verificar si ya existe un match entre los dos usuarios
    const checkQuery = `
        SELECT match_id 
        FROM matches 
        WHERE (user_id_1 = ? AND user_id_2 = ?) 
           OR (user_id_1 = ? AND user_id_2 = ?)
    `;
    const checkValues = [userId1, userId2, userId2, userId1];

    // Consulta para insertar un nuevo match
    const insertQuery = `
        INSERT INTO matches (user_id_1, user_id_2)
        VALUES (?, ?)
    `;
    const insertValues = [userId1, userId2];

    return new Promise((resolve, reject) => {
        // Primero, verificar si ya existe un match
        db.query(checkQuery, checkValues, (error, results) => {
            if (error) {
                return reject(error);
            }

            // Si ya existe un match, retornar un mensaje o el match existente
            if (results.length > 0) {
                return resolve({ 
                    message: "Match already exists", 
                    match: results[0] 
                });
            }

            // Si no existe, insertar el nuevo match
            db.query(insertQuery, insertValues, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve({ 
                    match_id: results.insertId, 
                    user_id_1: userId1, 
                    user_id_2: userId2 
                });
            });
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