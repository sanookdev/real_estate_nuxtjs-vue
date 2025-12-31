const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public
router.get('/', listingController.getAllListings);
// Admin route must come before /:id to prevent conflict
router.get('/admin/all', authMiddleware, roleMiddleware(['admin', 'superadmin']), listingController.getAdminListings);
router.get('/:id', listingController.getListingById);

// Protected
router.post('/', authMiddleware, upload.array('images', 5), listingController.createListing);
router.get('/user/my-listings', authMiddleware, listingController.getMyListings);
router.delete('/:id', authMiddleware, listingController.deleteListing);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'superadmin']), listingController.updateStatus);
router.put('/:id', authMiddleware, upload.array('images', 5), listingController.updateListing);

module.exports = router;
