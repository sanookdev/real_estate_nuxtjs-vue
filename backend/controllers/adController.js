const AdModel = require('../models/adModel');
const supabaseStorage = require('../services/supabaseStorage');
const path = require('path');

/**
 * Generate unique filename
 */
function generateFilename(originalname) {
    const ext = path.extname(originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return uniqueSuffix + ext;
}

exports.getAllAds = async (req, res) => {
    try {
        const ads = await AdModel.getAll();
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

exports.getActiveAds = async (req, res) => {
    try {
        const ads = await AdModel.getActive();
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

exports.createAd = async (req, res) => {
    try {
        const { link, position, active } = req.body;
        let image = '';

        // Upload to Supabase Storage
        if (req.file && supabaseStorage.isAvailable()) {
            const filename = generateFilename(req.file.originalname);
            const filePath = `ads/${filename}`;

            const result = await supabaseStorage.uploadFile(
                req.file.buffer,
                filePath,
                req.file.mimetype
            );

            if (result) {
                image = result.url;
            }
        }

        await AdModel.create({ image, link, position, active: active === 'true' || active === true });
        res.status(201).json({ message: 'Ad created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

exports.updateAd = async (req, res) => {
    try {
        const { link, position, active } = req.body;
        const ad = await AdModel.findById(req.params.id);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        let image = ad.image;

        // Upload new image to Supabase Storage
        if (req.file && supabaseStorage.isAvailable()) {
            const filename = generateFilename(req.file.originalname);
            const filePath = `ads/${filename}`;

            const result = await supabaseStorage.uploadFile(
                req.file.buffer,
                filePath,
                req.file.mimetype
            );

            if (result) {
                // Optional: Delete old image
                if (ad.image) {
                    const oldPath = supabaseStorage.extractPathFromUrl(ad.image);
                    if (oldPath) {
                        await supabaseStorage.deleteFile(oldPath);
                    }
                }
                image = result.url;
            }
        }

        await AdModel.update(req.params.id, {
            image,
            link,
            position,
            active: active === 'true' || active === true
        });

        res.json({ message: 'Ad updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        const ad = await AdModel.findById(req.params.id);

        // Delete image from Supabase Storage
        if (ad && ad.image && supabaseStorage.isAvailable()) {
            const imagePath = supabaseStorage.extractPathFromUrl(ad.image);
            if (imagePath) {
                await supabaseStorage.deleteFile(imagePath);
            }
        }

        await AdModel.delete(req.params.id);
        res.json({ message: 'Ad deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};
