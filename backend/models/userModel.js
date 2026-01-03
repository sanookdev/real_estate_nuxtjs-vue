const db = require('../config/db');

class UserModel {
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findByUsernameOrEmail(identifier) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [identifier, identifier]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(userData) {
        const {
            username,
            email,
            phone = null,
            password_hash,
            role = 'user',
            status = 'pending',
            email_verified_at = null
        } = userData;

        const [result] = await db.execute(
            'INSERT INTO users (username, email, phone, password_hash, role, status, email_verified_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, phone, password_hash, role, status, email_verified_at]
        );
        return result.insertId;
    }

    static async updateStatus(id, status) {
        await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    }

    static async updateRole(id, role) {
        await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }

    static async updatePassword(id, password_hash) {
        await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);
    }

    static async saveResetToken(id, token, expires_at) {
        await db.execute('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?', [token, expires_at, id]);
    }

    static async findByResetToken(token) {
        const [rows] = await db.execute('SELECT * FROM users WHERE reset_password_token = ?', [token]);
        return rows[0];
    }

    static async resetPassword(id, password_hash) {
        await db.execute('UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?', [password_hash, id]);
    }

    static async getAllUsers() {
        const [rows] = await db.execute('SELECT id, username, email, phone, role, status, email_verified_at, created_at FROM users');
        return rows;
    }

    static async deleteUser(id) {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
    }
}

module.exports = UserModel;
