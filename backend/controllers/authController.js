
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const sendEmail = require('../services/emailService');
const crypto = require('crypto');
require('dotenv').config();

exports.register = async (req, res) => {
    const fs = require('fs');
    const logPath = '/home/sanookdev555-home/Desktop/myproject/asset_sale/backend/error.log';
    try {
        fs.appendFileSync(logPath, 'Starting register...\n');
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
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
            console.error('Error reading settings during register:', settingsError);
            // Fallback to pending
        }

        // Generate verification token
        const verification_token = crypto.randomBytes(32).toString('hex');

        const userId = await UserModel.create({
            username,
            email,
            password_hash,
            status,
            verification_token
        });

        // Send Verification Email
        const verificationLink = `http://localhost:3000/auth/verify?token=${verification_token}`;
        const emailHtml = `
            <h1>Verify your email</h1>
            <p>Welcome to AssetSale! Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">${verificationLink}</a>
        `;

        await sendEmail(email, 'Verify your email - AssetSale', 'Please verify your email.', emailHtml);

        const message = status === 'approved'
            ? 'ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน'
            : 'ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน และรอการอนุมัติ';

        res.status(201).json({ message, userId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
};

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
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token required' });
        }

        const user = await UserModel.findByVerificationToken(token);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        await UserModel.verifyEmail(user.id);

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
        res.status(500).json({ message: 'Server error' });
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
        res.status(500).json({ message: 'Server error' });
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
        res.status(500).json({ message: 'Server error' });
    }
};
