require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
// Si implementas rutas para matches, chats, etc., las importarías aquí

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
// app.use('/match', matchRoutes); // Descomenta si ya tienes estas rutas

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor corriendo correctamente' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
