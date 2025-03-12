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

exports.checkForDoubleMatch = async (userId, likedUserId) => {
    // Obtener amigos de ambos usuarios
    const getFriendsQuery = `
        SELECT user_id FROM friends WHERE user_id = ? OR user_id = ?;
    `;
    
    const friendsResult = await db.query(getFriendsQuery, [userId, likedUserId]);

    const userFriends = friendsResult.filter(friend => friend.user_id === userId);
    const likedUserFriends = friendsResult.filter(friend => friend.user_id === likedUserId);

    for (let friend of userFriends) {
        for (let likedFriend of likedUserFriends) {
            const checkMatchQuery = `
                SELECT * FROM match
                WHERE (user_id_1 = ? AND user_id_2 = ?)
                    OR (user_id_2 = ? AND user_id_1 = ?);
            `;
            
            const matchResult = await db.query(checkMatchQuery, [friend.user_id, likedFriend.user_id, likedFriend.user_id, friend.user_id]);

            if (matchResult.length > 0) {
                const createDoubleMatchQuery = `
                    INSERT INTO matches_2pa (user_id_1, user_id_2, friend_1_id, friend_2_id)
                    VALUES (?, ?, ?, ?);
                `;
                await db.query(createDoubleMatchQuery, [userId, friend.user_id, likedUserId, likedFriend.user_id]);
                return { match2pa: { userId, friend: friend.user_id, likedUserId, likedFriend: likedFriend.user_id } };
            }
        }
    }

    return null;
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