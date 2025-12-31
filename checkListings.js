const db = require('./backend/config/db');

async function check() {
    try {
        const [rows] = await db.execute('SELECT * FROM listings');
        console.log('Listings count:', rows.length);
        if (rows.length > 0) {
            console.log('First listing:', JSON.stringify(rows[0], null, 2));
            console.log('Status of first listing:', rows[0].status);
        } else {
            console.log('No listings found in DB table.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
