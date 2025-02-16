const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.register = (req, res) => {
  const { name, email, password, birth_date, gender, city, profile_picture } = req.body;

  if (!name || !email || !password || !gender) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err.message });

    User.create(name, email, hash, birth_date, gender, city, profile_picture, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ message: 'Usuario registrado correctamente' });
    });
  });
};


exports.login = (req, res) => {
    const { email, password } = req.body;
  
    User.findByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
  
      const user = results[0];
  
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ error: err.message });
  
        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });
  
        const token = jwt.sign(
          { id: user.user_id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
  
        res.json({ message: 'Login exitoso', token });
      });
    });
  };
  
