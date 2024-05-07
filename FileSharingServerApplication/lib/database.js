const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./mydatabase.db');

function getAllUsers() {
    return db.prepare('SELECT * FROM users').all();
}

module.exports = {
    getAllUsers
};