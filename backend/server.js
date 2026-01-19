const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Real Estate Asset Sale API' });
});

app.get('/healthz', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});


// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const adRoutes = require('./routes/adRoutes'); // Added adRoutes import

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/ads', adRoutes); // Added adRoutes usage

// Global Error Handler - Shows detailed errors for debugging
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);

    const statusCode = err.statusCode || 500;
    const response = {
        message: err.message || 'Internal Server Error',
        error: err.message,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    };

    // Include stack trace in development/debug mode
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

const PORT = process.env.PORT || 5000;

// Only start server if not being imported (for Vercel serverless)
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;
