const db = require("../config/database");

// Obtener todas las fotos de un usuario
exports.getPhotosByUserId = async (userId) => {
    const [rows] = await db.query("SELECT photo_id, photo_url FROM photos WHERE user_id = ?", [userId]);
    return rows;
};

// Agregar una nueva foto
exports.addPhoto = async (userId, photoUrl) => {
    await db.query("INSERT INTO photos (user_id, photo_url) VALUES (?, ?)", [userId, photoUrl]);
};

// Eliminar una foto
exports.deletePhoto = async (userId, photoId) => {
    await db.query("DELETE FROM photos WHERE photo_id = ? AND user_id = ?", [photoId, userId]);
};
