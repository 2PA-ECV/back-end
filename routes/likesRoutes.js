const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');
const authMiddleware = require('../middlewares/authMiddleware');


// Ruta para manejar likes y dislikes
router.post('/', authMiddleware, likesController.handleLikeDislike);

module.exports = router;