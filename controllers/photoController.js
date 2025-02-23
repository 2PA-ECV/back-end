const Photo = require("../models/photoModel");
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Obtener todas las fotos del usuario
exports.getUserPhotos = async (req, res) => {
    const user_id = req.user.id;
    try {
        const photos = await Photo.getPhotosByUserId(user_id);
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener fotos" });
    }
};

// Subir una nueva foto
exports.uploadPhoto = async (req, res) => {
    const user_id = req.user.id;
    try {
        const photoUrl = `/uploads/${req.file.filename}`;
        await Photo.addPhoto(user_id, photoUrl);
        res.status(201).json({ message: "Foto subida", photo_url: photoUrl });
    } catch (error) {
        res.status(500).json({ error: "Error al subir la foto" });
    }
};

// Eliminar una foto
exports.deletePhoto = async (req, res) => {
    const user_id = req.user.id;
    try {
        const { id } = req.params;
        await Photo.deletePhoto(user_id, id);
        res.json({ message: "Foto eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la foto" });
    }
};

exports.getOtherUserPhotos = async (req, res) => {
    const userId = req.params.userId;

    try {
        const photos = await Photo.getPhotosByUserId(userId);
        res.json(photos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener fotos" });
    }
};

// Middleware para subir archivos con Multer
exports.uploadMiddleware = upload.single("photo");
