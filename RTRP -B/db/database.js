const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rtrp_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = {
    // Wrapper to mimic MySQL db.run
    run: function (sql, params, callback) {
        if (!callback && typeof params === 'function') {
            callback = params;
            params = [];
        }
        pool.query(sql, params, function (err, results) {
            if (err) {
                if (callback) callback(err);
                return;
            }
            // Bind 'this' for the callback to match MySQL behavior
            if (callback) {
                callback.call({
                    lastID: results.insertId,
                    changes: results.affectedRows
                }, null);
            }
        });
    },
    // Wrapper to mimic MySQL db.get
    get: function (sql, params, callback) {
        if (!callback && typeof params === 'function') {
            callback = params;
            params = [];
        }
        pool.query(sql, params, function (err, results) {
            if (err) {
                if (callback) callback(err);
                return;
            }
            // MySQL db.get returns undefined if no row found (wrapper converts empty array)
            const row = results && results.length > 0 ? results[0] : undefined;
            if (callback) callback(null, row);
        });
    },
    // Wrapper to mimic MySQL db.all
    all: function (sql, params, callback) {
        if (!callback && typeof params === 'function') {
            callback = params;
            params = [];
        }
        pool.query(sql, params, function (err, results) {
            if (callback) callback(err, results);
        });
    }
};

// Initialize Tables
pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        avatar TEXT,
        timeCredits INT DEFAULT 10,
        bio TEXT,
        role VARCHAR(255),
        location VARCHAR(255),
        website VARCHAR(255),
        is_online BOOLEAN DEFAULT FALSE,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) console.error("Error creating users table:", err);
    else console.log("Users table ensured.");
});

pool.query(`
    CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        category VARCHAR(255),
        hours DECIMAL(5,2),
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) console.error("Error creating skills table:", err);
    else console.log("Skills table ensured.");
});

// Create Chats/Messages Table
pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) console.error("Error creating messages table:", err);
    else console.log("Messages table ensured.");
});

module.exports = db;
