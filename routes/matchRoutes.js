const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para verificar si hay un match
router.post('/check', authMiddleware, matchesController.checkForMatch);
router.get('/', authMiddleware, matchesController.getMatchesByUser);
router.get("/:matchId", authMiddleware, matchesController.getMatchById);

module.exports = router;
