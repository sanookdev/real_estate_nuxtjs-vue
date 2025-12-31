const db = require('../config/db');

class ListingModel {
    static async create(data) {
        const { user_id, title, description, price, location, type, images, expires_at, property_condition, facilities, nearby_places, google_map_link, province, district, subdistrict, postal_code, status } = data;
        const [result] = await db.execute(
            'INSERT INTO listings (user_id, title, description, price, location, type, images, expires_at, property_condition, facilities, nearby_places, google_map_link, province, district, subdistrict, postal_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, title, description, price, location, type, JSON.stringify(images), expires_at, property_condition || 'new', JSON.stringify(facilities || []), nearby_places || null, google_map_link || null, province || null, district || null, subdistrict || null, postal_code || null, status || 'pending']
        );
        return result.insertId;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT l.*, u.username FROM listings l JOIN users u ON l.user_id = u.id WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND l.status = ?';
            params.push(filters.status);
        }

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
        const { title, description, price, location, type, images, status, property_condition, facilities, nearby_places, google_map_link, province, district, subdistrict, postal_code } = data;
        await db.execute(
            'UPDATE listings SET title=?, description=?, price=?, location=?, type=?, images=?, status=?, property_condition=?, facilities=?, nearby_places=?, google_map_link=?, province=?, district=?, subdistrict=?, postal_code=? WHERE id=?',
            [title, description, price, location, type, JSON.stringify(images), status, property_condition, JSON.stringify(facilities), nearby_places, google_map_link, province || null, district || null, subdistrict || null, postal_code || null, id]
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

    static async findWithPagination(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        let query = 'SELECT l.*, u.username FROM listings l JOIN users u ON l.user_id = u.id WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND l.status = ?';
            params.push(filters.status);
        }

        if (filters.search) {
            query += ' AND (l.title LIKE ? OR l.description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        if (filters.publisher) {
            query += ' AND u.username LIKE ?';
            params.push(`%${filters.publisher}%`);
        }

        if (filters.minPrice) {
            query += ' AND l.price >= ?';
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            query += ' AND l.price <= ?';
            params.push(filters.maxPrice);
        }

        if (filters.dateFrom) {
            query += ' AND l.created_at >= ?';
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            query += ' AND l.created_at <= ?';
            params.push(filters.dateTo + ' 23:59:59');
        }

        query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
        params.push(String(limit), String(offset));

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async countWithPagination(filters = {}) {
        let query = 'SELECT COUNT(*) as total FROM listings l WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND l.status = ?';
            params.push(filters.status);
        }

        if (filters.search) {
            query += ' AND (l.title LIKE ? OR l.description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        if (filters.publisher) {
            // Need join to filter by username in count as well if we filter by publisher name
            query = query.replace('FROM listings l', 'FROM listings l JOIN users u ON l.user_id = u.id');
            query += ' AND u.username LIKE ?';
            params.push(`%${filters.publisher}%`);
        }

        if (filters.minPrice) {
            query += ' AND l.price >= ?';
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            query += ' AND l.price <= ?';
            params.push(filters.maxPrice);
        }

        if (filters.dateFrom) {
            query += ' AND l.created_at >= ?';
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            query += ' AND l.created_at <= ?';
            params.push(filters.dateTo + ' 23:59:59');
        }

        const [rows] = await db.execute(query, params);
        return rows[0].total;
    }
}

module.exports = ListingModel;
