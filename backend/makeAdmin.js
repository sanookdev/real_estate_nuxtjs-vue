const db = require('./config/db');

async function makeAdmin() {
    try {
        const [result] = await db.execute("UPDATE users SET role='superadmin', status='approved' WHERE id=1");
        console.log(`Updated ${result.changedRows} rows.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

makeAdmin();
