const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/active', adController.getActiveAds);

// Admin
router.get('/all', authMiddleware, roleMiddleware(['admin', 'superadmin']), adController.getAllAds);
router.post('/', authMiddleware, roleMiddleware(['admin', 'superadmin']), upload.single('image'), adController.createAd);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'superadmin']), upload.single('image'), adController.updateAd);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'superadmin']), adController.deleteAd);

module.exports = router;
