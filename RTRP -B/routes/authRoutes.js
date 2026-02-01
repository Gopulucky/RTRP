const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Register
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const sql = `INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)`;
    db.run(sql, [username, email, hashedPassword, avatar], function (err) {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'User already exists' });
            }
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        const token = jwt.sign({ id: this.lastID, username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ message: 'User created successfully', token, user: { id: this.lastID, username, email, avatar, timeCredits: 10 } });
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Set user as online
        db.run('UPDATE users SET is_online = TRUE, last_seen = NOW() WHERE id = ?', [user.id]);

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                timeCredits: user.timeCredits,
                is_online: true
            }
        });
    });
});

module.exports = router;
