const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, profileController.getProfile);
router.post("/", authMiddleware, profileController.createOrUpdateProfile);

module.exports = router;

