
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
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

        const userId = await UserModel.create({
            username,
            email,
            password_hash,
            status
        });

        const message = status === 'approved'
            ? 'ลงทะเบียนสำเร็จ! คุณสามารถเข้าสู่ระบบได้ทันที'
            : 'ลงทะเบียนสำเร็จ! กรุณารอการอนุมัติจากผู้ดูแลระบบ';

        res.status(201).json({ message, userId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'approved' && user.role !== 'superadmin') {
            // Allow superadmin to login even if not explicitly "approved" (if we seed them as approved or handle differently)
            // Actually schema default is pending. Superadmin seed should set approved.
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
