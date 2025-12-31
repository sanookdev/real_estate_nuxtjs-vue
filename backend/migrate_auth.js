
const db = require('./config/db');

async function migrate() {
    try {
        console.log('Adding verification columns to users table...');

        // Check if columns exist
        const [columns] = await db.execute('SHOW COLUMNS FROM users LIKE "verification_token"');
        if (columns.length === 0) {
            await db.execute('ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) NULL AFTER status');
            console.log('Added verification_token');
        } else {
            console.log('verification_token already exists');
        }

        const [columns2] = await db.execute('SHOW COLUMNS FROM users LIKE "email_verified_at"');
        if (columns2.length === 0) {
            await db.execute('ALTER TABLE users ADD COLUMN email_verified_at DATETIME NULL AFTER verification_token');
            console.log('Added email_verified_at');
        } else {
            console.log('email_verified_at already exists');
        }

        // Fix for existing users: verify them all so they aren't locked out
        await db.execute('UPDATE users SET email_verified_at = NOW() WHERE email_verified_at IS NULL');
        console.log('Marked existing users as verified');

        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
