const Photo = require("../models/photoModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Extensiones permitidas
const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif"];

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error("Formato de archivo no permitido"));
        }
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error("Solo se permiten imágenes"));
        }
        cb(null, true);
    },
});

// Middleware para subir archivos con Multer
exports.uploadMiddleware = upload.single("photo");

// Obtener todas las fotos del usuario
exports.getUserPhotos = async (req, res) => {
    const user_id = req.user.id;
    try {
        const photos = await Photo.getPhotosByUserId(user_id);
        res.json(photos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener fotos" });
    }
};

// Subir una nueva foto
exports.uploadPhoto = async (req, res) => {
    const user_id = req.user.id;
    
    // Validación si no se subió un archivo
    if (!req.file) {
        return res.status(400).json({ error: "No se ha subido ninguna foto" });
    }

    try {
        const photoUrl = `/uploads/${req.file.filename}`;
        await Photo.addPhoto(user_id, photoUrl);
        res.status(201).json({ message: "Foto subida", photo_url: photoUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al subir la foto" });
    }
};

// Eliminar una foto
exports.deletePhoto = async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    try {
        const photo = await Photo.getPhotoById(id);
        
        if (!photo || photo.user_id !== user_id) {
            return res.status(404).json({ error: "Foto no encontrada o no tienes permisos" });
        }

        const filePath = path.join("..", photo.photo_url);
        
        // Eliminar archivo del servidor
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error("Error al eliminar archivo:", err);
            }
            await Photo.deletePhoto(photo.photo_url);
            res.json({ message: "Foto eliminada" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la foto" });
    }
};

// Obtener fotos de otro usuario
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
