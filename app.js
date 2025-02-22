require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const photoRoutes = require("./routes/photoRoutes");
const { authenticateToken } = require("./middlewares/authMiddleware");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use("/photos", authenticateToken, photoRoutes);

// app.use('/match', matchRoutes);


// Ruta principal de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor corriendo correctamente' });
});

// Iniciar el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
