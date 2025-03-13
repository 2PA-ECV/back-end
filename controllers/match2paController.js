const match2paModel = require('../models/match2paModel');

exports.getMatches2paByUserId = async (req, res) => {
    try {
        const userId = req.user.id; 
        const matches = await match2paModel.getMatches2paByUserId(userId);
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMatch2paById = async (req, res) => {
    try {
        const match2paId = req.params.match2paId;
        const match = await match2paModel.getMatch2paById(match2paId);
        if (match) {
            res.status(200).json(match);
        } else {
            res.status(404).json({ message: 'Match not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
