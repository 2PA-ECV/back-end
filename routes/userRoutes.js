const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController"); 

router.get("/next-user", authMiddleware, userController.getNextUser);
router.get("/", authMiddleware, userController.getUser);
router.get("/:id", authMiddleware, userController.getUserById);


module.exports = router;
