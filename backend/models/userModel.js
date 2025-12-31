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

    static async findByVerificationToken(token) {
        const [rows] = await db.execute('SELECT * FROM users WHERE verification_token = ?', [token]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(userData) {
        const { username, email, password_hash, role = 'user', status = 'pending', verification_token = null } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash, role, status, verification_token) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, password_hash, role, status, verification_token]
        );
        return result.insertId;
    }

    static async verifyEmail(id) {
        await db.execute('UPDATE users SET email_verified_at = NOW(), verification_token = NULL WHERE id = ?', [id]);
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
        const [rows] = await db.execute('SELECT id, username, email, role, status, created_at FROM users');
        return rows;
    }
}

module.exports = UserModel;
