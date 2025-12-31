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

        // Determine status: Admin/Superadmin -> active, User -> pending
        let initialStatus = 'pending';
        if (req.user.role === 'admin' || req.user.role === 'superadmin') {
            initialStatus = 'active';
        }

        // 1. Create Listings with empty or temp images (we will update later)
        // Note: ListingModel need to support status field if not already
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
            postal_code: postal_code || null,
            status: initialStatus
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
            type: req.query.type,
            status: 'active'
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

exports.updateStatus = async (req, res) => {
    try {
        // Admin only check is done in middleware usually, but good to be safe
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { status } = req.body;
        if (!['pending', 'active', 'rejected', 'sold'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await ListingModel.updateStatus(req.params.id, status);
        res.json({ message: `Listing status updated to ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAdminListings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const publisher = req.query.publisher;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const dateFrom = req.query.dateFrom;
        const dateTo = req.query.dateTo;

        const filters = {};
        if (status) filters.status = status;
        if (search) filters.search = search;
        if (publisher) filters.publisher = publisher;
        if (minPrice) filters.minPrice = minPrice;
        if (maxPrice) filters.maxPrice = maxPrice;
        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;

        const listings = await ListingModel.findWithPagination(filters, page, limit);
        const total = await ListingModel.countWithPagination(filters);
        const totalPages = Math.ceil(total / limit);

        const formattedListings = listings.map(l => ({
            ...l,
            images: typeof l.images === 'string' ? JSON.parse(l.images) : l.images
        }));

        res.json({
            listings: formattedListings,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateListing = async (req, res) => {
    try {
        const listing = await ListingModel.findById(req.params.id);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        // Check ownership or admin
        if (listing.user_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const {
            title, description, price, location, type,
            property_condition, facilities, nearby_places, google_map_link,
            province, district, subdistrict, postal_code
        } = req.body;

        // Handle new images if uploaded
        let images = listing.images;
        if (typeof images === 'string') images = JSON.parse(images);

        if (req.files && req.files.length > 0) {
            const tempImages = req.files.map(file => file.filename);
            const fs = require('fs');
            const path = require('path');
            const tempDir = 'uploads/temp';
            const targetDir = `uploads/listings/${listing.id}`;

            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

            const newImagePaths = [];
            for (const filename of tempImages) {
                const oldPath = path.join(tempDir, filename);
                const newPath = path.join(targetDir, filename);
                if (fs.existsSync(oldPath)) {
                    fs.renameSync(oldPath, newPath);
                    newImagePaths.push(`listings/${listing.id}/${filename}`);
                }
            }
            // Append new images
            images = [...images, ...newImagePaths];
        }

        // Update DB
        const updateData = {
            title: title || listing.title,
            description: description || listing.description,
            price: price || listing.price,
            location: location || listing.location,
            type: type || listing.type,
            images: images,
            status: listing.status,
            property_condition: property_condition || listing.property_condition,
            facilities: facilities ? JSON.parse(facilities) : (listing.facilities ? (typeof listing.facilities === 'string' ? JSON.parse(listing.facilities) : listing.facilities) : []),
            nearby_places: nearby_places || listing.nearby_places,
            google_map_link: google_map_link || listing.google_map_link,
            province: province || listing.province,
            district: district || listing.district,
            subdistrict: subdistrict || listing.subdistrict,
            postal_code: postal_code || listing.postal_code
        };

        await ListingModel.update(req.params.id, updateData);
        res.json({ message: 'Listing updated successfully', listing: updateData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
