const db = require('../config/db');

class ListingModel {
    static async create(data) {
        const { user_id, title, description, price, location, type, images, expires_at, property_condition, facilities, nearby_places, google_map_link, province, district, subdistrict, postal_code } = data;
        const [result] = await db.execute(
            'INSERT INTO listings (user_id, title, description, price, location, type, images, expires_at, property_condition, facilities, nearby_places, google_map_link, province, district, subdistrict, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, title, description, price, location, type, JSON.stringify(images), expires_at, property_condition || 'new', JSON.stringify(facilities || []), nearby_places || null, google_map_link || null, province || null, district || null, subdistrict || null, postal_code || null]
        );
        return result.insertId;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT l.*, u.username FROM listings l JOIN users u ON l.user_id = u.id WHERE l.status = "active"';
        const params = [];

        if (filters.type) {
            query += ' AND l.type = ?';
            params.push(filters.type);
        }
        // Add more filters as needed

        query += ' ORDER BY l.created_at DESC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT l.*, u.username, u.email FROM listings l JOIN users u ON l.user_id = u.id WHERE l.id = ?', [id]);
        return rows[0];
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }

    static async update(id, data) {
        // Dynamic update query could be better, but fixed fields for now
        // Actually, handling partial updates is safer.
        // For simplicity in this step, I'll assume full update or handling in controller.
        // Let's do a quick implementation that updates core fields.
        const { title, description, price, location, type, images, status, property_condition, facilities, nearby_places, google_map_link } = data;
        await db.execute(
            'UPDATE listings SET title=?, description=?, price=?, location=?, type=?, images=?, status=?, property_condition=?, facilities=?, nearby_places=?, google_map_link=? WHERE id=?',
            [title, description, price, location, type, JSON.stringify(images), status, property_condition, JSON.stringify(facilities), nearby_places, google_map_link, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM listings WHERE id = ?', [id]);
    }

    static async updateStatus(id, status) {
        await db.execute('UPDATE listings SET status = ? WHERE id = ?', [status, id]);
    }

    static async updateImages(id, images) {
        await db.execute('UPDATE listings SET images = ? WHERE id = ?', [JSON.stringify(images), id]);
    }
}

module.exports = ListingModel;
