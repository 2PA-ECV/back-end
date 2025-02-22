const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();
const md5 = require('md5'); 

exports.register = async (req, res) => {
    const { name, email, username, password, birth_date, gender, city, profile_picture } = req.body;

    // Validación de campos obligatorios
    if (!name || !email || !password || !gender || !username) {
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

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        // Encriptar la contraseña
        const salt_string = process.env.MD5_SALT_STRING;
        const safe_password = md5(password + salt_string);

        // Guardar el usuario con la contraseña encriptada
        await new Promise((resolve, reject) => {
            User.create({ 
                name, 
                username,
                email,
                password: safe_password, 
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
    const { emailorusername, password } = req.body;
  
    User.findByEmail(emailorusername, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
  
        if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
  
        const user = results[0];
        
        const salt_string = process.env.MD5_SALT_STRING;
        const safe_password = md5(password + salt_string);

        if (safe_password !== user.password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }else{
            const token = jwt.sign(
                { id: user.user_id, name: user.name, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
              );
        
              res.json({ message: 'Login exitoso', token });
        }
      
      });
  };
  
