const SettingsModel = require('../models/settingsModel');
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
            site_favicon: allSettings.site_favicon,
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

        // Handle File Uploads (Logo & Favicon) to Supabase Storage
        if (req.files && supabaseStorage.isAvailable()) {
            const uploadFile = async (fileField) => {
                if (req.files[fileField] && req.files[fileField][0]) {
                    const file = req.files[fileField][0];
                    const filename = generateFilename(file.originalname);
                    const filePath = `settings/${filename}`;

                    const result = await supabaseStorage.uploadFile(
                        file.buffer,
                        filePath,
                        file.mimetype
                    );

                    if (result) {
                        // Get old value to delete from storage
                        const oldValue = await SettingsModel.get(fileField);
                        if (oldValue) {
                            const oldPath = supabaseStorage.extractPathFromUrl(oldValue);
                            if (oldPath) {
                                await supabaseStorage.deleteFile(oldPath);
                            }
                        }
                        settings[fileField] = result.url;
                    }
                }
            };

            await uploadFile('site_logo');
            await uploadFile('site_favicon');
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
