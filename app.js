require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


// Importar rutas
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const photoRoutes = require("./routes/photoRoutes");
const userRoutes = require("./routes/userRoutes");
const likesRoutes = require('./routes/likesRoutes');
const matchesRoutes = require("./routes/matchRoutes")
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use("/photos", photoRoutes);
app.use("/user", userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/likes', likesRoutes);
app.use('/matches', matchesRoutes);



// Ruta principal de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor corriendo correctamente' });
});

// Iniciar el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
