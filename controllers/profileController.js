const Profile = require("../models/profileModel");
const upload = require("../config/multer-config"); 


// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
    try {
        const user_id = req.user.id; // Extraído desde el token
        const profile = await Profile.getProfile(user_id);

        if (!profile) {
            return res.status(404).json({ message: "Perfil no encontrado." });
        }

        return res.status(200).json(profile);
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};

// Crear o actualizar perfil
const createOrUpdateProfile = async (req, res) => {
    try {
        const user_id = req.user.id; // Extraído del token
        const { bio, interests, min_age_preference, max_age_preference, preferred_city, altura, lifestyle, preferences, profile_picture } = req.body;

        // Validaciones básicas
        if (!bio || !interests || !min_age_preference || !max_age_preference || !preferred_city) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Obtener la ruta de la imagen subida (si existe)
        const profile_image = profile_picture ? profile_picture.path : null;

        // Llamar al modelo para crear o actualizar el perfil
        const result = await Profile.createOrUpdateProfile(
            user_id,
            bio,
            interests,
            min_age_preference,
            max_age_preference,
            preferred_city,
            altura,
            lifestyle,
            preferences,
            profile_image 
        );

        return res.status(200).json({ message: "Perfil guardado exitosamente." });
    } catch (error) {
        console.error("Error al crear o actualizar el perfil:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};

module.exports = {
    getProfile,
    createOrUpdateProfile: [upload.single('profile_image'), createOrUpdateProfile] // Añadir middleware de Multer
};