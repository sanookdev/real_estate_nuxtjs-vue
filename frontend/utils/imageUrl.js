/**
 * Image URL Helper
 * 
 * Handles both legacy local paths and new Supabase Storage URLs
 */

const API_URL = 'http://localhost:5000';

/**
 * Get the proper image URL
 * - If image is already a full URL (http/https), return as-is
 * - Otherwise, prepend the API URL for legacy local images
 * 
 * @param {string} imagePath - Image path or URL
 * @returns {string} - Full URL to the image
 */
export function getImageUrl(imagePath) {
    if (!imagePath) return '';

    // If already a full URL (Supabase or any external URL)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Legacy local path - prepend API URL
    return `${API_URL}/uploads/${imagePath}`;
}

/**
 * Get image URL for a listing
 * Returns first image URL or placeholder
 * 
 * @param {Object} listing - Listing object with images array
 * @param {string} placeholder - Optional placeholder URL
 * @returns {string} - Image URL
 */
export function getListingImageUrl(listing, placeholder = 'https://placehold.co/600x400/166534/ffffff?text=Property') {
    if (!listing?.images?.length || !listing.images[0]) {
        return placeholder;
    }
    return getImageUrl(listing.images[0]);
}

export default {
    getImageUrl,
    getListingImageUrl
};
