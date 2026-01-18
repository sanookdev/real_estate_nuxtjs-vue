/**
 * Supabase Storage Service
 * 
 * Handles file uploads to Supabase Storage
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate URL format
const isValidUrl = (url) => {
    if (!url) return false;
    try {
        return /^https?:\/\//i.test(url.trim());
    } catch {
        return false;
    }
};

let supabase = null;

if (isValidUrl(supabaseUrl) && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✓ Supabase Storage client initialized');
    } catch (error) {
        console.warn('⚠️ Failed to initialize Supabase client:', error.message);
    }
} else {
    console.warn('⚠️ Supabase Storage not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
}

// Default bucket name
const DEFAULT_BUCKET = 'uploads';

/**
 * Upload a file to Supabase Storage
 * 
 * @param {Buffer} fileBuffer - File buffer from multer memoryStorage
 * @param {string} filePath - Path within the bucket (e.g., 'listings/1/image.jpg')
 * @param {string} mimeType - MIME type of the file
 * @param {string} bucket - Bucket name (default: 'uploads')
 * @returns {Promise<{url: string, path: string} | null>} - Public URL and path, or null on error
 */
async function uploadFile(fileBuffer, filePath, mimeType, bucket = DEFAULT_BUCKET) {
    if (!supabase) {
        console.error('Supabase client not initialized');
        return null;
    }

    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileBuffer, {
                contentType: mimeType,
                upsert: true  // Overwrite if exists
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return null;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return {
            path: filePath,
            url: urlData.publicUrl
        };
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
}

/**
 * Delete a file from Supabase Storage
 * 
 * @param {string} filePath - Path within the bucket
 * @param {string} bucket - Bucket name (default: 'uploads')
 * @returns {Promise<boolean>} - true if deleted, false on error
 */
async function deleteFile(filePath, bucket = DEFAULT_BUCKET) {
    if (!supabase) {
        console.error('Supabase client not initialized');
        return false;
    }

    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Supabase delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete error:', error);
        return false;
    }
}

/**
 * Delete multiple files from Supabase Storage
 * 
 * @param {string[]} filePaths - Array of paths within the bucket
 * @param {string} bucket - Bucket name (default: 'uploads')
 * @returns {Promise<boolean>} - true if all deleted, false on error
 */
async function deleteFiles(filePaths, bucket = DEFAULT_BUCKET) {
    if (!supabase || filePaths.length === 0) {
        return false;
    }

    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove(filePaths);

        if (error) {
            console.error('Supabase delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete error:', error);
        return false;
    }
}

/**
 * Get public URL for a file
 * 
 * @param {string} filePath - Path within the bucket
 * @param {string} bucket - Bucket name (default: 'uploads')
 * @returns {string | null} - Public URL or null
 */
function getPublicUrl(filePath, bucket = DEFAULT_BUCKET) {
    if (!supabase) {
        return null;
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

/**
 * Check if Supabase Storage is available
 * @returns {boolean}
 */
function isAvailable() {
    return supabase !== null;
}

/**
 * Extract path from Supabase URL
 * Converts full URL back to storage path
 * 
 * @param {string} url - Full Supabase storage URL
 * @returns {string | null} - Storage path or null if not a Supabase URL
 */
function extractPathFromUrl(url) {
    if (!url || !supabaseUrl) return null;

    // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/path
    const prefix = `${supabaseUrl}/storage/v1/object/public/${DEFAULT_BUCKET}/`;

    if (url.startsWith(prefix)) {
        return url.replace(prefix, '');
    }

    return null;
}

module.exports = {
    uploadFile,
    deleteFile,
    deleteFiles,
    getPublicUrl,
    isAvailable,
    extractPathFromUrl,
    DEFAULT_BUCKET
};
