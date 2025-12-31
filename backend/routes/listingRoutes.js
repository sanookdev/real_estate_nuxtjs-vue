const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);

// Protected
router.post('/', authMiddleware, upload.array('images', 5), listingController.createListing);
router.get('/user/my-listings', authMiddleware, listingController.getMyListings);
router.delete('/:id', authMiddleware, listingController.deleteListing);

module.exports = router;
