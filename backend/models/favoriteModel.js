const db = require('../config/db');

class FavoriteModel {
    static async add(userId, listingId) {
        try {
            await db.execute('INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)', [userId, listingId]);
            return true;
        } catch (error) {
            // PostgreSQL unique violation error code is '23505'
            if (error.code === '23505') return false; // Already exists
            throw error;
        }
    }

    static async remove(userId, listingId) {
        await db.execute('DELETE FROM favorites WHERE user_id = ? AND listing_id = ?', [userId, listingId]);
    }

    static async getByUserId(userId) {
        const [rows] = await db.execute('SELECT listing_id FROM favorites WHERE user_id = ?', [userId]);
        return rows.map(row => row.listing_id);
    }

    static async getWithDetails(userId) {
        const [rows] = await db.execute(`
            SELECT l.* 
            FROM favorites f
            JOIN listings l ON f.listing_id = l.id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        `, [userId]);

        // Parse images if they are strings (JSONB in PostgreSQL returns objects)
        return rows.map(row => ({
            ...row,
            images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images
        }));
    }
}

module.exports = FavoriteModel;
