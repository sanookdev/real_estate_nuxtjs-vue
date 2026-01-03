const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Get all users - Admin & Superadmin
router.get('/', authMiddleware, roleMiddleware(['admin', 'superadmin']), userController.getAllUsers);

// Approve user - Admin & Superadmin
router.put('/:id/approve', authMiddleware, roleMiddleware(['admin', 'superadmin']), userController.approveUser);

// Block user - Admin & Superadmin
router.put('/:id/block', authMiddleware, roleMiddleware(['admin', 'superadmin']), userController.blockUser);

// Update user role - Superadmin only
router.put('/:id/role', authMiddleware, roleMiddleware(['superadmin']), userController.updateUserRole);

// Delete user - Superadmin only
router.delete('/:id', authMiddleware, roleMiddleware(['superadmin']), userController.deleteUser);

module.exports = router;

