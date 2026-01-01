const mysql = require('mysql2');
require('dotenv').config();

// Check if using TiDB Cloud (requires SSL)
const isTiDB = process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com');

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Add SSL for TiDB Cloud
if (isTiDB) {
    poolConfig.ssl = {
        rejectUnauthorized: true
    };
    console.log('🔒 TiDB Cloud detected - SSL enabled');
}

const pool = mysql.createPool(poolConfig);

module.exports = pool.promise();
