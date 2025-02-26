const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
    level: 'info', 
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, 'server.log') }), // Guardar logs en un archivo
        new transports.Console() // Mostrar logs en la consola
    ]
});

module.exports = logger;
