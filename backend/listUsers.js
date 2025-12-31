const db = require('./config/db');

async function listUsers() {
    try {
        const [rows] = await db.execute('SELECT * FROM users');
        console.log(JSON.stringify(rows, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listUsers();
