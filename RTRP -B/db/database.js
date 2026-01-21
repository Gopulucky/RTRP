const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Users Table
        // We'll create the table if it doesn't exist.
        // For existing tables in this dev environment, we might want to ALTER it or just recreate it if it's new.
        // Since we are iterating, let's try to add columns if they are missing (simple migration) or just rely on CREATE IF NOT EXISTS for fresh starts.
        // Given the agentic context, I will just CREATE IF NOT EXISTS with the FULL schema. 
        // If the user already has data and I need to add columns, I should run ALTER TABLE statements separately.

        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            avatar TEXT,
            timeCredits INTEGER DEFAULT 10,
            bio TEXT,
            role TEXT,
            location TEXT,
            website TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error("Error creating users table:", err);
            } else {
                // Attempt to add new columns if they don't exist (primitive migration)
                const columns = ['bio', 'role', 'location', 'website'];
                columns.forEach(col => {
                    db.run(`ALTER TABLE users ADD COLUMN ${col} TEXT`, (err) => {
                        // Ignore error if column exists
                    });
                });
            }
        });
    }
});

module.exports = db;
