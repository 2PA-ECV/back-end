const Chat = require('../models/chatModel');

exports.addMessage = async (req, res) => {
    try {
        const { matchId, senderId, message } = req.body;

        if (!matchId || !senderId || !message) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        await Chat.addMessage(matchId, senderId, message);

        res.status(201).json({ message: "Mensaje guardado correctamente" });
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { matchId } = req.params;

        if (!matchId) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const messages = await Chat.getMessages(matchId);
        res.status(200).json({ matchId, messages });
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
