const matchModel = require('../models/matchModel');
const likeModel = require('../models/likesModel'); 


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

            const match2pa = await matchModel.checkForDoubleMatch(userId, likedUserId);

            if (match2pa) {
                return res.status(201).json({ message: 'Match doble creado', match2pa: match2pa });
            }

            return res.status(201).json({ message: 'Match creado', match: newMatch });
        }

        res.status(200).json({ message: 'No hay match' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar el match' });
    }
};


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