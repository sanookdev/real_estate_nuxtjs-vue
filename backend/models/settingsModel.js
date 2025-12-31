const db = require('../config/db');

class SettingsModel {
    static async get(key) {
        const [rows] = await db.execute('SELECT setting_value FROM settings WHERE setting_key = ?', [key]);
        return rows[0] ? rows[0].setting_value : null;
    }

    static async set(key, value) {
        // Upsert equivalent
        const [existing] = await db.execute('SELECT id FROM settings WHERE setting_key = ?', [key]);
        if (existing.length > 0) {
            await db.execute('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
        } else {
            await db.execute('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, value]);
        }
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM settings');
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        return settings;
    }
}

module.exports = SettingsModel;
