const express = require('express');
const router = express.Router();
const sqliteDb = require('../db/database');
const auth = require('../middleware/auth');
const store = require('../data/store'); // Fallback for skills

// GET current user
router.get('/', auth, (req, res) => {
    sqliteDb.get('SELECT id, username, email, avatar, timeCredits, bio, role, location, website FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(row);
    });
});

// GET all users (public profiles)
router.get('/all', (req, res) => {
    sqliteDb.all('SELECT id, username, avatar, bio, role, location, website FROM users', [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(rows);
    });
});

// PUT update user profile
router.put('/', auth, (req, res) => {
    const { bio, role, location, website, avatar } = req.body;

    const updates = [];
    const params = [];

    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (role !== undefined) { updates.push('role = ?'); params.push(role); }
    if (location !== undefined) { updates.push('location = ?'); params.push(location); }
    if (website !== undefined) { updates.push('website = ?'); params.push(website); }
    if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'No updates provided' });
    }

    params.push(req.user.id);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    sqliteDb.run(sql, params, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        // Return updated user
        sqliteDb.get('SELECT id, username, email, avatar, timeCredits, bio, role, location, website FROM users WHERE id = ?', [req.user.id], (err, row) => {
            if (err) return res.status(500).json({ message: 'Fetch error' });
            res.json(row);
        });
    });
});

// POST add credits
router.post('/credits/add', auth, (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    sqliteDb.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!row) return res.status(404).json({ message: 'User not found' });

        const newCredits = (row.timeCredits || 0) + amount;

        sqliteDb.run('UPDATE users SET timeCredits = ? WHERE id = ?', [newCredits, req.user.id], function (err) {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ ...row, timeCredits: newCredits });
        });
    });
});

// POST spend credits
router.post('/credits/spend', auth, (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    sqliteDb.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!row) return res.status(404).json({ message: 'User not found' });

        if ((row.timeCredits || 0) < amount) {
            return res.status(400).json({ message: 'Insufficient credits' });
        }

        const newCredits = row.timeCredits - amount;

        sqliteDb.run('UPDATE users SET timeCredits = ? WHERE id = ?', [newCredits, req.user.id], function (err) {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ ...row, timeCredits: newCredits });
        });
    });
});

// GET user skills (My Skills)
router.get('/skills', auth, (req, res) => {
    sqliteDb.all('SELECT * FROM skills WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(rows);
    });
});

// POST add user skill
router.post('/skills', auth, (req, res) => {
    const { title, description, category, hours } = req.body;
    if (!title || !description || !category || !hours) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `INSERT INTO skills (title, description, category, hours, user_id) VALUES (?, ?, ?, ?, ?)`;
    sqliteDb.run(sql, [title, description, category, hours, req.user.id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        const newSkill = { id: this.lastID, title, description, category, hours, user_id: req.user.id };
        res.status(201).json(newSkill);
    });
});

// DELETE user skill
router.delete('/skills/:id', auth, (req, res) => {
    const { id } = req.params;

    // Check ownership
    sqliteDb.run('DELETE FROM skills WHERE id = ? AND user_id = ?', [id, req.user.id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Skill not found or not authorized' });
        }
        res.json({ message: 'Skill deleted successfully' });
    });
});

// PUT update user skill
router.put('/skills/:id', auth, (req, res) => {
    const { id } = req.params;
    const { title, description, category, hours } = req.body;

    // Construct update query dynamically
    const updates = [];
    const params = [];
    if (title) { updates.push('title = ?'); params.push(title); }
    if (description) { updates.push('description = ?'); params.push(description); }
    if (category) { updates.push('category = ?'); params.push(category); }
    if (hours) { updates.push('hours = ?'); params.push(hours); }

    if (updates.length === 0) return res.status(400).json({ message: 'No updates provided' });

    const sql = `UPDATE skills SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;
    params.push(id, req.user.id);

    sqliteDb.run(sql, params, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Skill not found or not authorized' });
        }
        res.json({ id, title, description, category, hours, user_id: req.user.id });
    });
});

module.exports = router;
