const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();
const argon2 = require('argon2');

exports.register = async (req, res) => {
    const { name, email, password, birth_date, gender, city, profile_picture } = req.body;

    // Validación de campos obligatorios
    if (!name || !email || !password || !gender) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser  = await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (existingUser .length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        // Encriptar la contraseña
        const hashedPassword = await argon2.hash(password);

        // Guardar el usuario con la contraseña encriptada
        await new Promise((resolve, reject) => {
            User.create({ 
                name, 
                email, 
                password: hashedPassword, 
                birth_date, 
                gender, 
                city, 
                profile_picture: profile_picture || null 
            }, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        return res.status(500).json({ error: `Error al registrar el usuario: ${err.message}` });
    }
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
  
