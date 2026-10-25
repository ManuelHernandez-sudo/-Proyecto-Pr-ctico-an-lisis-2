const { Pool } = require('pg');

// La cadena de conexión SIEMPRE viene de variables de entorno (nunca del repo).
module.exports = new Pool({ connectionString: process.env.DATABASE_URL });
