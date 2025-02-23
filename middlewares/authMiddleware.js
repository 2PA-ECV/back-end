const jwt = require("jsonwebtoken");
require("dotenv").config(); // Asegúrate de cargar las variables de entorno

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Acceso denegado, token no proporcionado o inválido" });
        }
        const token = authHeader.split(" ")[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};


