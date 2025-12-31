const ListingModel = require('../models/listingModel');

exports.createListing = async (req, res) => {
    try {
        const {
            title, description, price, location, type, expires_at,
            property_condition, facilities, nearby_places, google_map_link,
            province, district, subdistrict, postal_code
        } = req.body;

        // Initial images are just filenames from temp folder
        const tempImages = req.files ? req.files.map(file => file.filename) : [];

        if (!title || !price) {
            return res.status(400).json({ message: 'Title and Price are required' });
        }

        // Default expiry 30 days if not provided
        const expiryDate = expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // 1. Create Listings with empty or temp images (we will update later)
        const listingId = await ListingModel.create({
            user_id: req.user.id,
            title,
            description,
            price,
            location,
            type,
            images: [], // Start empty, will update after move
            expires_at: expiryDate,
            property_condition,
            facilities: facilities ? JSON.parse(facilities) : [],
            nearby_places,
            google_map_link,
            province: province || null,
            district: district || null,
            subdistrict: subdistrict || null,
            postal_code: postal_code || null
        });

        // 2. Move files from temp to uploads/listings/{id}
        const fs = require('fs');
        const path = require('path');
        const newImagePaths = [];

        if (tempImages.length > 0) {
            const tempDir = 'uploads/temp';
            const targetDir = `uploads/listings/${listingId}`;

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            for (const filename of tempImages) {
                const oldPath = path.join(tempDir, filename);
                const newFilename = filename; // Keep same filename
                const newPath = path.join(targetDir, newFilename);

                if (fs.existsSync(oldPath)) {
                    fs.renameSync(oldPath, newPath);
                    // Store relative path for frontend usage
                    newImagePaths.push(`listings/${listingId}/${newFilename}`);
                }
            }

            // 3. Update Listing with new paths
            await ListingModel.updateImages(listingId, newImagePaths);
        }

        res.status(201).json({ message: 'Listing created successfully', listingId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllListings = async (req, res) => {
    try {
        const filters = {
            type: req.query.type
        };
        const listings = await ListingModel.findAll(filters);

        // Parse images JSON (actually mysql2 might return string)
        const formattedListings = listings.map(l => ({
            ...l,
            images: typeof l.images === 'string' ? JSON.parse(l.images) : l.images
        }));

        res.json(formattedListings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await ListingModel.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        listing.images = typeof listing.images === 'string' ? JSON.parse(listing.images) : listing.images;
        res.json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyListings = async (req, res) => {
    try {
        const listings = await ListingModel.findByUserId(req.user.id);
        const formattedListings = listings.map(l => ({
            ...l,
            images: typeof l.images === 'string' ? JSON.parse(l.images) : l.images
        }));
        res.json(formattedListings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteListing = async (req, res) => {
    try {
        const listing = await ListingModel.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        // Check ownership or admin
        if (listing.user_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await ListingModel.delete(req.params.id);
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
