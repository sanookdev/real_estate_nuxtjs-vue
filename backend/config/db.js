/**
 * PostgreSQL Database Connection (Supabase)
 * 
 * Uses the 'pg' library for direct PostgreSQL connection.
 * Compatible with Supabase's PostgreSQL database.
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Log connection status
pool.on('connect', () => {
    console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
});

/**
 * Execute a query with automatic placeholder conversion
 * Converts MySQL-style ? placeholders to PostgreSQL $1, $2, $3...
 * 
 * @param {string} text - SQL query (can use ? or $n placeholders)
 * @param {Array} params - Query parameters
 * @returns {Promise<[Array, Object]>} - [rows, result] for compatibility with mysql2
 */
async function execute(text, params = []) {
    // Convert ? placeholders to $1, $2, $3... for PostgreSQL
    let paramIndex = 0;
    const pgText = text.replace(/\?/g, () => `$${++paramIndex}`);

    try {
        const result = await pool.query(pgText, params);
        return [result.rows, result];
    } catch (error) {
        console.error('Query error:', pgText, params);
        throw error;
    }
}

/**
 * Execute a raw query without placeholder conversion
 * Use this when you're already using $1, $2 style placeholders
 * 
 * @param {string} text - SQL query with $n placeholders
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} - Query result
 */
async function query(text, params = []) {
    try {
        return await pool.query(text, params);
    } catch (error) {
        console.error('Query error:', text, params);
        throw error;
    }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} - Database client
 */
async function getClient() {
    return await pool.connect();
}

module.exports = {
    execute,
    query,
    getClient,
    pool
};
