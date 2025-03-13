const express = require('express');
const match2paController = require('../controllers/match2paController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener los matches de un usuario
router.get('/', authMiddleware, match2paController.getMatches2paByUserId);

// Ruta para obtener un match por su ID
router.get('/:match2paId', authMiddleware, match2paController.getMatch2paById);

module.exports = router;