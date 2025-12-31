const SettingsModel = require('../models/settingsModel');

exports.getSettings = async (req, res) => {
    try {
        const settings = await SettingsModel.getAll();
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getPublicSettings = async (req, res) => {
    try {
        const allSettings = await SettingsModel.getAll();
        const publicSettings = {
            site_name: allSettings.site_name,
            site_description: allSettings.site_description,
            site_logo: allSettings.site_logo,
            content_about_us: allSettings.content_about_us,
            contact_line: allSettings.contact_line,
            contact_facebook: allSettings.contact_facebook,
            contact_phone: allSettings.contact_phone,
            contact_email: allSettings.contact_email,
            contact_address: allSettings.contact_address
        };
        res.json(publicSettings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateSettings = async (req, res) => {
    try {
        const settings = req.body; // Expect object { key: value, ... }

        // Handle Logo Upload
        // Handle Logo Upload
        if (req.file) {
            // Move file from temp to uploads root
            const fs = require('fs');
            const path = require('path');
            const oldPath = req.file.path;
            const newPath = path.join('uploads', req.file.filename);

            fs.renameSync(oldPath, newPath);
            settings.site_logo = req.file.filename;
        }

        for (const [key, value] of Object.entries(settings)) {
            await SettingsModel.set(key, value);
        }

        res.json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
