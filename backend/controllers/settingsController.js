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

exports.updateSettings = async (req, res) => {
    try {
        const settings = req.body; // Expect object { key: value, ... }

        for (const [key, value] of Object.entries(settings)) {
            await SettingsModel.set(key, value);
        }

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
