const db = require('../config/db');

class ListingModel {
    static async create(data) {
        const { user_id, title, description, price, location, type, images, expires_at, property_condition, facilities, nearby_places, google_map_link, province, district, subdistrict, postal_code, status } = data;
        const [rows] = await db.execute(
            'INSERT INTO listings (user_id, title, description, price, location, type, images, expires_at, property_condition, facilities, nearby_places, google_map_link, province, district, subdistrict, postal_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
            [user_id, title, description, price, location, type, JSON.stringify(images), expires_at, property_condition || 'new', JSON.stringify(facilities || []), nearby_places || null, google_map_link || null, province || null, district || null, subdistrict || null, postal_code || null, status || 'pending']
        );
        return rows[0].id;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT l.*, u.username FROM listings l JOIN users u ON l.user_id = u.id WHERE 1=1';
        const params = [];
        let paramIndex = 0;

        if (filters.status) {
            paramIndex++;
            query += ` AND l.status = $${paramIndex}`;
            params.push(filters.status);
        }

        if (filters.type) {
            paramIndex++;
            query += ` AND l.type = $${paramIndex}`;
            params.push(filters.type);
        }

        query += ' ORDER BY l.created_at DESC';

        const result = await db.query(query, params);
        return result.rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT l.*, u.username, u.email, u.phone FROM listings l JOIN users u ON l.user_id = u.id WHERE l.id = ?', [id]);
        return rows[0];
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute('SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }

    static async update(id, data) {
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
        let paramIndex = 0;

        if (filters.status) {
            paramIndex++;
            query += ` AND l.status = $${paramIndex}`;
            params.push(filters.status);
        }

        if (filters.search) {
            const searchTerm = `%${filters.search}%`;
            paramIndex++;
            query += ` AND (l.title ILIKE $${paramIndex}`;
            params.push(searchTerm);
            paramIndex++;
            query += ` OR l.description ILIKE $${paramIndex})`;
            params.push(searchTerm);
        }

        if (filters.publisher) {
            paramIndex++;
            query += ` AND u.username ILIKE $${paramIndex}`;
            params.push(`%${filters.publisher}%`);
        }

        if (filters.minPrice) {
            paramIndex++;
            query += ` AND l.price >= $${paramIndex}`;
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            paramIndex++;
            query += ` AND l.price <= $${paramIndex}`;
            params.push(filters.maxPrice);
        }

        if (filters.dateFrom) {
            paramIndex++;
            query += ` AND l.created_at >= $${paramIndex}`;
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            paramIndex++;
            query += ` AND l.created_at <= $${paramIndex}`;
            params.push(filters.dateTo + ' 23:59:59');
        }

        if (filters.isPinned === 'true' || filters.isPinned === true) {
            query += ' AND l.is_pinned = TRUE';
        }

        paramIndex++;
        query += ` ORDER BY l.created_at DESC LIMIT $${paramIndex}`;
        params.push(limit);

        paramIndex++;
        query += ` OFFSET $${paramIndex}`;
        params.push(offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    static async countWithPagination(filters = {}) {
        let query = 'SELECT COUNT(*) as total FROM listings l';
        const params = [];
        let paramIndex = 0;
        let hasPublisherFilter = false;

        // Check if we need join for publisher filter
        if (filters.publisher) {
            query += ' JOIN users u ON l.user_id = u.id';
            hasPublisherFilter = true;
        }

        query += ' WHERE 1=1';

        if (filters.status) {
            paramIndex++;
            query += ` AND l.status = $${paramIndex}`;
            params.push(filters.status);
        }

        if (filters.search) {
            const searchTerm = `%${filters.search}%`;
            paramIndex++;
            query += ` AND (l.title ILIKE $${paramIndex}`;
            params.push(searchTerm);
            paramIndex++;
            query += ` OR l.description ILIKE $${paramIndex})`;
            params.push(searchTerm);
        }

        if (hasPublisherFilter) {
            paramIndex++;
            query += ` AND u.username ILIKE $${paramIndex}`;
            params.push(`%${filters.publisher}%`);
        }

        if (filters.minPrice) {
            paramIndex++;
            query += ` AND l.price >= $${paramIndex}`;
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            paramIndex++;
            query += ` AND l.price <= $${paramIndex}`;
            params.push(filters.maxPrice);
        }

        if (filters.dateFrom) {
            paramIndex++;
            query += ` AND l.created_at >= $${paramIndex}`;
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            paramIndex++;
            query += ` AND l.created_at <= $${paramIndex}`;
            params.push(filters.dateTo + ' 23:59:59');
        }

        if (filters.isPinned === 'true' || filters.isPinned === true) {
            query += ' AND l.is_pinned = TRUE';
        }

        const result = await db.query(query, params);
        return parseInt(result.rows[0].total);
    }

    // Get all pinned listings for Hot Sale section
    static async findPinned() {
        const [rows] = await db.execute(
            'SELECT l.*, u.username FROM listings l JOIN users u ON l.user_id = u.id WHERE l.is_pinned = TRUE AND l.status = ? ORDER BY l.pinned_at DESC',
            ['active']
        );
        return rows;
    }

    // Toggle pin status of a listing
    static async togglePin(id) {
        // First get current pin status
        const [current] = await db.execute('SELECT is_pinned FROM listings WHERE id = ?', [id]);
        if (current.length === 0) return null;

        const newPinStatus = !current[0].is_pinned;
        const pinnedAt = newPinStatus ? new Date() : null;

        await db.execute(
            'UPDATE listings SET is_pinned = ?, pinned_at = ? WHERE id = ?',
            [newPinStatus, pinnedAt, id]
        );

        return newPinStatus;
    }
}

module.exports = ListingModel;
