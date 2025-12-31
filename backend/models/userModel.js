const db = require('../config/db');

class UserModel {
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(userData) {
        const { username, email, password_hash, role = 'user', status = 'pending' } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
            [username, email, password_hash, role, status]
        );
        return result.insertId;
    }

    static async updateStatus(id, status) {
        await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    }

    static async updateRole(id, role) {
        await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }

    static async getAllUsers() {
        const [rows] = await db.execute('SELECT id, username, email, role, status, created_at FROM users');
        return rows;
    }
}

module.exports = UserModel;
