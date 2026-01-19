
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const PendingVerificationModel = require('../models/pendingVerificationModel');
const sendEmail = require('../services/emailService');
const crypto = require('crypto');
require('dotenv').config();

// OTP Configuration
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// ============================================
// STEP 1: Send OTP to Email (Pre-Verify)
// ============================================
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'กรุณากรอกอีเมล' });
        }

        // Check if email is already registered
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'อีเมลนี้มีผู้ใช้งานแล้ว กรุณาเข้าสู่ระบบ' });
        }

        // Check existing pending verification
        const existing = await PendingVerificationModel.findByEmail(email);
        if (existing && PendingVerificationModel.isLocked(existing)) {
            const lockoutRemaining = Math.ceil((new Date(existing.lockout_until) - new Date()) / 60000);
            return res.status(429).json({
                message: `กรุณารอ ${lockoutRemaining} นาที ก่อนขอรหัส OTP ใหม่`,
                locked: true,
                lockoutUntil: existing.lockout_until
            });
        }

        // Generate OTP
        const otp = PendingVerificationModel.generateOtp();
        const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

        // Save pending verification
        await PendingVerificationModel.createOrUpdate(email, otp, otpExpires);

        // Send OTP Email
        const emailHtml = `
            <h1>รหัส OTP ยืนยันอีเมล</h1>
            <p>รหัส OTP ของคุณคือ:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; color: #22c55e; font-family: monospace;">${otp}</h2>
            <p>รหัสนี้จะหมดอายุใน <strong>${OTP_EXPIRY_MINUTES} นาที</strong></p>
            <p style="color: #888;">หากคุณไม่ได้ขอรหัสนี้ กรุณาเพิกเฉยอีเมลนี้</p>
        `;

        await sendEmail(email, 'รหัส OTP ยืนยันอีเมล - AssetSale', `รหัส OTP ของคุณคือ: ${otp}`, emailHtml);

        res.json({
            message: 'ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว',
            email: email,
            expiresIn: OTP_EXPIRY_MINUTES * 60 // seconds
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ============================================
// STEP 2: Verify OTP
// ============================================
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัส OTP' });
        }

        const pending = await PendingVerificationModel.findByEmail(email);
        if (!pending) {
            return res.status(400).json({ message: 'ไม่พบรหัส OTP กรุณาขอรหัสใหม่' });
        }

        // Check if already verified
        if (pending.verified_at) {
            return res.status(400).json({ message: 'อีเมลนี้ได้รับการยืนยันแล้ว' });
        }

        // Check lockout
        if (PendingVerificationModel.isLocked(pending)) {
            const lockoutRemaining = Math.ceil((new Date(pending.lockout_until) - new Date()) / 60000);
            return res.status(429).json({
                message: `บัญชีถูกล็อคชั่วคราว กรุณารอ ${lockoutRemaining} นาที`,
                locked: true,
                lockoutUntil: pending.lockout_until
            });
        }

        // Check expiry
        if (new Date(pending.otp_expires) < new Date()) {
            return res.status(400).json({
                message: 'รหัส OTP หมดอายุ กรุณาขอรหัสใหม่',
                expired: true
            });
        }

        // Check OTP
        if (pending.otp_code !== otp) {
            await PendingVerificationModel.incrementAttempts(pending.id);

            const newAttempts = pending.otp_attempts + 1;

            if (newAttempts >= MAX_OTP_ATTEMPTS) {
                const lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60000);
                await PendingVerificationModel.setLockout(pending.id, lockoutUntil);
                return res.status(429).json({
                    message: `กรอกผิดเกินจำนวน ถูกล็อค ${LOCKOUT_MINUTES} นาที`,
                    locked: true,
                    lockoutUntil: lockoutUntil
                });
            }

            return res.status(400).json({
                message: `รหัส OTP ไม่ถูกต้อง (เหลือ ${MAX_OTP_ATTEMPTS - newAttempts} ครั้ง)`,
                attemptsRemaining: MAX_OTP_ATTEMPTS - newAttempts
            });
        }

        // OTP correct - mark as verified and generate registration token
        const registrationToken = await PendingVerificationModel.markVerified(pending.id);

        res.json({
            message: 'ยืนยันอีเมลสำเร็จ! กรุณากรอกข้อมูลเพิ่มเติม',
            verified: true,
            email: email,
            registrationToken: registrationToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

// ============================================
// STEP 3: Complete Registration
// ============================================
exports.completeRegistration = async (req, res) => {
    try {
        const { registrationToken, username, phone, password } = req.body;

        if (!registrationToken || !username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
        }

        // Find verified pending registration
        const pending = await PendingVerificationModel.findByToken(registrationToken);
        if (!pending) {
            return res.status(400).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ กรุณาสมัครใหม่' });
        }

        // Check if email is still available
        const existingUser = await UserModel.findByEmail(pending.email);
        if (existingUser) {
            await PendingVerificationModel.deleteByEmail(pending.email);
            return res.status(409).json({ message: 'อีเมลนี้มีผู้ใช้งานแล้ว' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Check auto-approve setting
        let status = 'pending';
        try {
            const SettingsModel = require('../models/settingsModel');
            const autoApprove = await SettingsModel.get('auto_approve_users');
            if (autoApprove === 'true') {
                status = 'approved';
            }
        } catch (settingsError) {
            console.error('Error reading settings:', settingsError);
        }

        // Create user (already verified)
        const userId = await UserModel.create({
            username,
            email: pending.email,
            phone: phone || null,
            password_hash,
            status,
            email_verified_at: new Date()
        });

        // Clean up pending verification
        await PendingVerificationModel.deleteByEmail(pending.email);

        const message = status === 'approved'
            ? 'สร้างบัญชีสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว'
            : 'สร้างบัญชีสำเร็จ! กรุณารอการอนุมัติจากผู้ดูแลระบบ';

        res.status(201).json({
            message,
            userId,
            canLogin: status === 'approved'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ============================================
// Resend OTP
// ============================================
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'กรุณาระบุอีเมล' });
        }

        // Check if email is already registered
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'อีเมลนี้มีผู้ใช้งานแล้ว' });
        }

        const existing = await PendingVerificationModel.findByEmail(email);

        // Check lockout
        if (existing && PendingVerificationModel.isLocked(existing)) {
            const lockoutRemaining = Math.ceil((new Date(existing.lockout_until) - new Date()) / 60000);
            return res.status(429).json({
                message: `กรุณารอ ${lockoutRemaining} นาที`,
                locked: true
            });
        }

        // Generate new OTP
        const otp = PendingVerificationModel.generateOtp();
        const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

        await PendingVerificationModel.createOrUpdate(email, otp, otpExpires);

        // Send email
        const emailHtml = `
            <h1>รหัส OTP ใหม่</h1>
            <p>รหัส OTP ของคุณคือ:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; color: #22c55e; font-family: monospace;">${otp}</h2>
            <p>รหัสนี้จะหมดอายุใน <strong>${OTP_EXPIRY_MINUTES} นาที</strong></p>
        `;

        await sendEmail(email, 'รหัส OTP ใหม่ - AssetSale', `รหัส OTP ของคุณคือ: ${otp}`, emailHtml);

        res.json({
            message: 'ส่งรหัส OTP ใหม่ไปยังอีเมลของคุณแล้ว',
            expiresIn: OTP_EXPIRY_MINUTES * 60
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

// ============================================
// Login
// ============================================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // email field can now contain username or email

        const user = await UserModel.findByUsernameOrEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.email_verified_at) {
            return res.status(403).json({ message: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ' });
        }

        if (user.status !== 'approved' && user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Account not approved or blocked' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};


exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        await UserModel.updatePassword(userId, password_hash);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const reset_token = crypto.randomBytes(32).toString('hex');
        // Token expires in 1 hour
        const expires_at = new Date(Date.now() + 3600000);

        // Update User
        await UserModel.saveResetToken(user.id, reset_token, expires_at);

        // Send Email
        const resetLink = `http://localhost:3000/auth/reset-password?token=${reset_token}`;
        const emailHtml = `
            <h1>Reset Your Password</h1>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        await sendEmail(email, 'Reset Password - AssetSale', 'Reset your password', emailHtml);

        res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = await UserModel.findByResetToken(token);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Check expiry (assuming MySql returns Date object or string)
        if (new Date(user.reset_password_expires) < new Date()) {
            return res.status(400).json({ message: 'Token expired' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        await UserModel.resetPassword(user.id, password_hash);

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};
