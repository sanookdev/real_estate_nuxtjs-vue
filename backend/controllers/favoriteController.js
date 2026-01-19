
const FavoriteModel = require('../models/favoriteModel');

exports.toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { listingId } = req.body;

        if (!listingId) {
            return res.status(400).json({ message: 'Listing ID required' });
        }

        const favorites = await FavoriteModel.getByUserId(userId);
        const exists = favorites.includes(listingId);

        if (exists) {
            await FavoriteModel.remove(userId, listingId);
            res.json({ message: 'Removed from favorites', favorited: false });
        } else {
            await FavoriteModel.add(userId, listingId);
            res.json({ message: 'Added to favorites', favorited: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

exports.getMyFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await FavoriteModel.getByUserId(userId);
        res.json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};

exports.getMyFavoriteDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await FavoriteModel.getWithDetails(userId);
        res.json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error.stack });
    }
};
