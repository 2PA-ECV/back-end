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

function queryPromise(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

exports.checkForDoubleMatch = async (userId, likedUserId) => {
    const getFriendsQuery = `
        SELECT user_id_1, user_id_2 FROM friends WHERE user_id_1 = ? OR user_id_2 = ? OR user_id_1 = ? OR user_id_2 = ?;
    `;
    
    try {
        console.log(`Obteniendo amigos de los usuarios ${userId} y ${likedUserId}`);
        const friendsResult = await queryPromise(getFriendsQuery, [userId, userId, likedUserId, likedUserId]);
        console.log('Amigos obtenidos:', friendsResult);

        const userFriends = [];
        const likedUserFriends = [];

        for (const friend of friendsResult) {
            console.log(`Verificando amigo: user_id_1: ${friend.user_id_1}, user_id_2: ${friend.user_id_2}`);
        
            // Aseguramos que los valores sean números
            const userId1 = parseInt(friend.user_id_1, 10);
            const userId2 = parseInt(friend.user_id_2, 10);
            const likedUser = parseInt(likedUserId, 10);
        
            // Amigos del usuario actual (sin incluir al mismo usuario)
            if (userId1 === parseInt(userId)) {
                console.log(`Amigo del usuario actual encontrado:`, friend);
                userFriends.push(userId2);
            } else if (userId2 === parseInt(userId)) {
                console.log(`Amigo del usuario actual encontrado:`, friend);
                userFriends.push(userId1);
            }
        
            if (userId1 === parseInt(likedUser)) {
                console.log('Amigo encontrado liked:', friend);
                likedUserFriends.push(userId2);
            }else if (userId2 === parseInt(likedUser)) {
                console.log('Amigo encontrado liked:', friend);
                likedUserFriends.push(userId1);
            }
        }
        
        console.log('Amigos del usuario actual:', userFriends);
        console.log('Amigos del usuario marcado:', likedUserFriends);

        if (userFriends.length === 0 || likedUserFriends.length === 0) {
            console.log('No se encontraron amigos para ambos usuarios.');
            return null;
        }

        for (let friend of userFriends) {
            console.log(`Usuario ${userId} - Amigo encontrado: ${friend}`);
            const friendId = parseInt(friend, 10);
            
            for (let likedFriend of likedUserFriends) {
                const likedFriendId = parseInt(likedFriend, 10);
                console.log(`Comprobando si hay match entre ${friendId} y ${likedFriendId}`);
                
                
                if (friendId !== likedFriendId) {
                    console.log(`Ejecutando consulta de match entre ${friendId} y ${likedFriendId}`);
                    
                    const checkMatchQuery = `
                        SELECT * FROM matches
                        WHERE (user_id_1 = ? AND user_id_2 = ?)
                           OR (user_id_1 = ? AND user_id_2 = ?);
                    `;
                    
                    const matchResult = await queryPromise(checkMatchQuery, [friendId, likedFriendId, likedFriendId, friendId]);
                    console.log('Resultado de la comprobación de match:', matchResult);
                    
                    if (matchResult.length > 0) {
                        console.log('Match encontrado. Verificando si el match doble ya existe...');
                        
                        const checkExistingMatchQuery = `
                            SELECT * FROM matches_2pa 
                            WHERE 
                            (user_id_1 = ? AND user_id_2 = ? AND friend_1_id = ? AND friend_2_id = ?) OR
                            (user_id_1 = ? AND user_id_2 = ? AND friend_1_id = ? AND friend_2_id = ?) OR
                            (user_id_1 = ? AND user_id_2 = ? AND friend_1_id = ? AND friend_2_id = ?) OR
                            (user_id_1 = ? AND user_id_2 = ? AND friend_1_id = ? AND friend_2_id = ?);
                        `;

                        const existingMatch = await queryPromise(checkExistingMatchQuery, [
                            userId, friendId, likedUserId, likedFriendId,  // Original
                            friendId, userId, likedFriendId, likedUserId,  // Espejo completo
                            userId, friendId, likedFriendId, likedUserId,  // Invertido dentro de cada par
                            friendId, userId, likedUserId, likedFriendId   // Espejo del invertido
                        ]);

                    
                        if (existingMatch.length > 0) {
                            console.log('El match doble ya existe. No se insertará nuevamente.');
                            return { message: 'Match ya existente', match2pa: existingMatch[0] };
                        }
                    
                        console.log('Creando match doble...');
                        const createDoubleMatchQuery = `
                            INSERT INTO matches_2pa (user_id_1, user_id_2, friend_1_id, friend_2_id)
                            VALUES (?, ?, ?, ?);
                        `;
                        await queryPromise(createDoubleMatchQuery, [userId, friendId, likedUserId, likedFriendId]);
                        console.log('Match doble creado:', { userId, friend: friendId, likedUserId, likedFriend: likedFriendId });
                    
                        return { match2pa: { userId, friend: friendId, likedUserId, likedFriend: likedFriendId } };
                    } else {
                        console.log(`No se encontró un match entre ${friendId} y ${likedFriendId}.`);
                    }
                    
                }
            }
        }
        
    } catch (error) {
        console.error('Error en checkForDoubleMatch:', error);
        throw error;
    }
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