const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getNextUser } = require("../models/userModel");

router.get("/next-user", authMiddleware, userController.getNextUser);

module.exports = router;
