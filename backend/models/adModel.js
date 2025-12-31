const db = require('../config/db');

class AdModel {
    static async create(data) {
        const { image, link, position, active } = data;
        const [result] = await db.execute(
            'INSERT INTO ads (image, link, position, active) VALUES (?, ?, ?, ?)',
            [image, link, position, active || true]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM ads ORDER BY position, created_at DESC');
        return rows;
    }

    static async getActive() {
        const [rows] = await db.execute('SELECT * FROM ads WHERE active = 1 ORDER BY position, created_at DESC');
        return rows;
    }

    static async update(id, data) {
        const { image, link, position, active } = data;
        await db.execute(
            'UPDATE ads SET image=?, link=?, position=?, active=? WHERE id=?',
            [image, link, position, active, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM ads WHERE id = ?', [id]);
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM ads WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = AdModel;
