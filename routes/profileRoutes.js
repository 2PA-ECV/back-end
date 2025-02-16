const express = require('express');
const router = express.Router();
const Profile = require('../models/profileModel');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:user_id', authMiddleware, Profile.getProfile);
router.post('/', authMiddleware, Profile.createOrUpdateProfile);

module.exports = router;
