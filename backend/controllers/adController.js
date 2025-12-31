const AdModel = require('../models/adModel');
const fs = require('fs');
const path = require('path');

exports.getAllAds = async (req, res) => {
    try {
        const ads = await AdModel.getAll();
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getActiveAds = async (req, res) => {
    try {
        const ads = await AdModel.getActive();
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createAd = async (req, res) => {
    try {
        const { link, position, active } = req.body;
        let image = '';

        if (req.file) {
            image = req.file.filename;
            const tempPath = path.join('uploads/temp', image);
            const targetDir = 'uploads/ads';
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            const targetPath = path.join(targetDir, image);
            fs.renameSync(tempPath, targetPath);
            image = `ads/${image}`;
        }

        await AdModel.create({ image, link, position, active: active === 'true' || active === true });
        res.status(201).json({ message: 'Ad created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAd = async (req, res) => {
    try {
        const { link, position, active } = req.body;
        const ad = await AdModel.findById(req.params.id);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        let image = ad.image;
        if (req.file) {
            const newImage = req.file.filename;
            const tempPath = path.join('uploads/temp', newImage);
            const targetDir = 'uploads/ads';
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            const targetPath = path.join(targetDir, newImage);
            fs.renameSync(tempPath, targetPath);
            image = `ads/${newImage}`;
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
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        await AdModel.delete(req.params.id);
        res.json({ message: 'Ad deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
