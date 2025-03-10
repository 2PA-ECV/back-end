const matchModel = require('../models/matchModel');
const likeModel = require('../models/likesModel'); 
const match2paModel = require('../models/match2paModel');


// Función para verificar si hay un match entre dos usuarios
exports.checkForMatch = async (req, res) => {
    const userId = req.user.id; 
    const likedUserId = req.body.likedUserId; 

    if (!likedUserId) {
        return res.status(400).json({ message: 'Falta el ID del usuario a revisar' });
    }

    try {
        const userLike = await likeModel.getLike(userId, likedUserId);
        const likedUserLike = await likeModel.getLike(likedUserId, userId);

        if (userLike && userLike.action === 'like' && likedUserLike && likedUserLike.action === 'like') {
            const newMatch = await matchModel.createMatch(userId, likedUserId);
            return res.status(201).json({ message: 'Match creado', match: newMatch });
        }

        res.status(200).json({ message: 'No hay match' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar el match' });
    }
};

// exports.checkForMatch = async (req, res) => {
//     const userId = req.user.id;
//     const likedUserId = req.body.likedUserId;

//     if (!likedUserId) {
//         return res.status(400).json({ message: 'Falta el ID del usuario a revisar' });
//     }

//     try {
//         const newMatch = await exports.checkForMatchIndividual(userId, likedUserId);

//         if (!newMatch) {
//             return res.status(200).json({ message: 'No hay match' });
//         }

//         const match2pa = await exports.checkForDoubleMatch(userId, likedUserId);

//         if (match2pa) {
//             return res.status(201).json({ message: 'Match doble creado', match2pa });
//         }

//         return res.status(201).json({ message: 'Match individual creado', match: newMatch });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error al verificar el match' });
//     }
// };

// exports.checkForMatchIndividual = async (userId, likedUserId) => {
//     const userLike = await matchModel.getLike(userId, likedUserId);
//     const likedUserLike = await matchModel.getLike(likedUserId, userId);

//     if (userLike && userLike.action === 'like' && likedUserLike && likedUserLike.action === 'like') {
//         return await matchModel.createMatch(userId, likedUserId);
//     }
//     return null;
// };

// exports.checkForDoubleMatch = async (userId, likedUserId) => {
//     const userFriends = await friendsModel.getFriends(userId);
//     const likedUserFriends = await friendsModel.getFriends(likedUserId);

//     for (let friend of userFriends) {
//         for (let likedFriend of likedUserFriends) {
//             const friendLike = await matchModel.getLike(friend.user_id, likedFriend.user_id);
//             const likedFriendLike = await matchModel.getLike(likedFriend.user_id, friend.user_id);

//             if (friendLike && likedFriendLike && friendLike.action === 'like' && likedFriendLike.action === 'like') {
//                 const match2pa = await match2paModel.createDoubleMatch(userId, friend.user_id, likedUserId, likedFriend.user_id);

//                 return {match2pa};
//             }
//         }
//     }
//     return null;
// };

exports.getMatchesByUser  = async (req, res) => {
    const userId = req.user.id; 

    try {
        const matches = await matchModel.getMatchesByUserId(userId);
        res.status(200).json(matches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los matches' });
    }
};

exports.getMatchById = async (req, res) => {
    const matchId = req.params.matchId; 

    try {
        const match = await matchModel.getMatchById(matchId);
        res.status(200).json(match);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el match' });
    }
};