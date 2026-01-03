const UserModel = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await UserModel.updateStatus(id, 'approved');
        res.json({ message: 'User approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await UserModel.updateStatus(id, 'blocked');
        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // 'admin' or 'user' (only superadmin should access this generally)

        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await UserModel.updateRole(id, role);
        res.json({ message: `User role updated to ${role}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user.id;

        // Prevent deleting self
        if (parseInt(id) === requestingUserId) {
            return res.status(400).json({ message: 'ไม่สามารถลบบัญชีตัวเองได้' });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
        }

        // Prevent deleting superadmin
        if (user.role === 'superadmin') {
            return res.status(403).json({ message: 'ไม่สามารถลบ Superadmin ได้' });
        }

        await UserModel.deleteUser(id);
        res.json({ message: 'ลบผู้ใช้งานเรียบร้อย' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
