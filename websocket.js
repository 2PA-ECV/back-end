const { Server } = require("socket.io");
const http = require("http");
const Chat = require("./models/chatModel");

const websocketPort = 4000; // Puerto para WebSockets
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir cualquier origen (ajustar en producción)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Unirse a un room de chat
  socket.on("joinRoom", (matchId) => {
    socket.join(matchId);
    console.log(`Usuario ${socket.id} se unió a la sala ${matchId}`);
  });

  // Enviar mensaje en un chat
  socket.on("sendMessage", async ({ matchId, senderId, message }) => {
    const chatMessage = {
      senderId,
      message,
      timestamp: new Date()
    };

    if (matchId.startsWith("match-")){
      const match = matchId.split("-")[1];
      await Chat.addMessage(match, senderId, message);
    }
    // Enviar mensaje a todos los usuarios en la sala
    try {
      io.to(matchId).emit("receiveMessage", chatMessage);
      console.log(`Mensaje en sala ${matchId}:`, chatMessage);
    } catch (error) {
      console.error("Error al guardar mensaje:", error);
    }
  });

  // Desconexión de usuario
  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Iniciar el servidor WebSocket
server.listen(websocketPort, () => {
  console.log(`Servidor WebSocket corriendo en ws://localhost:${websocketPort}`);
});
