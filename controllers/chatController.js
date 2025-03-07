const Chat = require('../models/chatModel');

exports.sendMessage = (req, res) => {
  const { matchId, senderId, message } = req.body;

  if (!matchId || !senderId || !message) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  // Añadir mensaje a la BD
  const newMessage = { matchId, senderId, message };

  res.status(201).json({ message: "Mensaje enviado", data: newMessage });
};

exports.getMessages = (req, res) => {
  const { matchId } = req.params;

  // Obtener mensajes de la BD
  const messages = [
      { senderId: 1, message: "Hola" },
      { senderId: 2, message: "¿Cómo estás?" },
  ];

  res.status(200).json({ matchId, messages });
};