const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, photoController.getUserPhotos);
router.post("/", authMiddleware, photoController.uploadMiddleware, photoController.uploadPhoto);
router.delete("/:id", authMiddleware, photoController.deletePhoto);
router.get("/:userId", authMiddleware, photoController.getOtherUserPhotos);
router.post("/profilephoto", authMiddleware, photoController.uploadMiddleware, photoController.uploadProfilePhoto);


module.exports = router;
