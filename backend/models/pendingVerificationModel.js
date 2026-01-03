const db = require('../config/db');
const crypto = require('crypto');

class PendingVerificationModel {
    // Generate 6-digit OTP
    static generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Generate registration token (64 characters)
    static generateRegistrationToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Find by email
    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM pending_verifications WHERE email = ? ORDER BY created_at DESC LIMIT 1',
            [email]
        );
        return rows[0];
    }

    // Find by registration token
    static async findByToken(token) {
        const [rows] = await db.execute(
            'SELECT * FROM pending_verifications WHERE registration_token = ? AND verified_at IS NOT NULL',
            [token]
        );
        return rows[0];
    }

    // Create or update pending verification
    static async createOrUpdate(email, otpCode, otpExpires) {
        // Delete existing pending verifications for this email
        await db.execute('DELETE FROM pending_verifications WHERE email = ?', [email]);

        // Create new
        const [result] = await db.execute(
            'INSERT INTO pending_verifications (email, otp_code, otp_expires) VALUES (?, ?, ?)',
            [email, otpCode, otpExpires]
        );
        return result.insertId;
    }

    // Increment OTP attempts
    static async incrementAttempts(id) {
        await db.execute('UPDATE pending_verifications SET otp_attempts = otp_attempts + 1 WHERE id = ?', [id]);
    }

    // Set lockout
    static async setLockout(id, lockoutUntil) {
        await db.execute(
            'UPDATE pending_verifications SET lockout_until = ?, otp_attempts = 0 WHERE id = ?',
            [lockoutUntil, id]
        );
    }

    // Check if locked
    static isLocked(record) {
        if (!record.lockout_until) return false;
        return new Date(record.lockout_until) > new Date();
    }

    // Mark as verified and generate registration token
    static async markVerified(id) {
        const registrationToken = this.generateRegistrationToken();
        await db.execute(
            'UPDATE pending_verifications SET verified_at = NOW(), registration_token = ?, otp_attempts = 0, lockout_until = NULL WHERE id = ?',
            [registrationToken, id]
        );
        return registrationToken;
    }

    // Delete by email
    static async deleteByEmail(email) {
        await db.execute('DELETE FROM pending_verifications WHERE email = ?', [email]);
    }

    // Clean up expired unverified records (older than 1 hour)
    static async cleanupExpired() {
        await db.execute(
            'DELETE FROM pending_verifications WHERE verified_at IS NULL AND created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)'
        );
    }
}

module.exports = PendingVerificationModel;
