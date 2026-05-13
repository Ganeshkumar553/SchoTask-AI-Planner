const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to Aiven MySQL database successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Check your Render Environment Variables (DB_HOST, DB_USER, etc.)');
    }
})();

module.exports = pool;