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
    // Wrapper to mimic sqlite3 db.run
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
            // Bind 'this' for the callback to match sqlite3 behavior
            if (callback) {
                callback.call({
                    lastID: results.insertId,
                    changes: results.affectedRows
                }, null);
            }
        });
    },
    // Wrapper to mimic sqlite3 db.get
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
            // sqlite3 db.get returns undefined if no row found, mysql returns empty array
            const row = results && results.length > 0 ? results[0] : undefined;
            if (callback) callback(null, row);
        });
    },
    // Wrapper to mimic sqlite3 db.all
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

// Seed Data similar to before (optional, maybe check if empty first)
const seedUsers = [
    { id: 1, username: 'gopu hardik', email: 'gopu@example.com', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=c6bze&backgroundColor=e9d5ff' },
    { id: 2, username: 'testuser', email: 'test@example.com', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ws6m7h&backgroundColor=e9d5ff' },
    { id: 3, username: 'sreeja', email: 'sreeja@example.com', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1gfhspc&backgroundColor=fde68a' },
    { id: 4, username: 'md. ali', email: 'ali@example.com', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=vpw4v2x&backgroundColor=e9d5ff' }
];

// Simple check to seed only if empty
db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (!err && row && row.count === 0) {
        console.log("Seeding initial data...");
        seedUsers.forEach(user => {
            pool.query("INSERT IGNORE INTO users (id, username, email, avatar) VALUES (?, ?, ?, ?)",
                [user.id, user.username, user.email, user.avatar]);
        });

        const seedSkills = [
            { id: 101, title: "React.js Mentorship", description: "I can help you master React hooks...", category: "Programming", hours: 2, user_id: 1 },
            { id: 102, title: "Vocal Training Basics", description: "Learn breathing techniques...", category: "Music", hours: 1, user_id: 3 },
            { id: 103, title: "SQL Performance Tuning", description: "Analyze your queries...", category: "Programming", hours: 3, user_id: 4 },
            { id: 104, title: "Digital Marketing 101", description: "How to run your first FB ad campaign...", category: "Academic", hours: 1.5, user_id: 2 },
            { id: 105, title: "Piano for Kids", description: "Fun and engaging piano lessons...", category: "Music", hours: 1, user_id: 3 }
        ];

        seedSkills.forEach(skill => {
            pool.query("INSERT IGNORE INTO skills (id, title, description, category, hours, user_id) VALUES (?, ?, ?, ?, ?, ?)",
                [skill.id, skill.title, skill.description, skill.category, skill.hours, skill.user_id]);
        });
    }
});

module.exports = db;
