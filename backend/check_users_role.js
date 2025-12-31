const UserModel = require('./models/userModel');
require('dotenv').config();

async function checkUsers() {
    try {
        const users = await UserModel.getAllUsers();
        console.table(users);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUsers();
