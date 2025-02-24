const likeModel = require('../models/likesModel');

exports.handleLikeDislike = async (req, res) => {
    const { likedUserId, action } = req.body;
    const userId = req.user.id;


    if (!userId || !likedUserId || !action) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const result = await likeModel.saveLikeDislike(userId, likedUserId, action);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};