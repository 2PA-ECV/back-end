const chatController = {
    sendMessage: (req, res) => {
      const { matchId, senderId, message } = req.body;
  
      if (!matchId || !senderId || !message) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }
  
      //Añadir mensaje a la BD

      res.status(201).json({ message: "Mensaje enviado", data: newMessage });
    },
  
    getMessages: (req, res) => {
      const { matchId } = req.params;
  
      // Obtener mensajes de la BD
  
      res.status(200).json({ matchId, messages });
    },
  };
  
  export default chatController;
  