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
        res.status(500).json({ error: "Error al obtener el siguiente usuario" });
    }
};