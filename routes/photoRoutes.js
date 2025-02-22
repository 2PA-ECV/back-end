const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");

router.get("/", photoController.getUserPhotos);
router.post("/", photoController.uploadMiddleware, photoController.uploadPhoto);
router.delete("/:id", photoController.deletePhoto);

module.exports = router;
