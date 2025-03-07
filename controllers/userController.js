const User = require("../models/userModel");

exports.getNextUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const nextUser = await User.getNextUser(userId);

        if (!nextUser) {
            return res.status(404).json({ message: "No hay más usuarios disponibles" });
        }

        res.json(nextUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el siguiente usuario" });
    }
};

exports.getUser = async (req, res) => {
    const userId = req.user.id; // Asegúrate de que `req.user` tenga la propiedad `id`

    try {
        const user = await User.getUser(userId); // Suponiendo que `User.findById` es la función para obtener el usuario
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user); // Devuelve la información del usuario
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la información del usuario" });
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.getUser(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user); // Devuelve la información del usuario
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la información del usuario" });
    }
}
