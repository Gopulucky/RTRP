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

// GET user skills (Legacy from store)
router.get('/skills', (req, res) => {
    const userSkills = store.getUserSkills();
    res.json(userSkills);
});

// POST add user skill (Legacy from store)
// POST add user skill (Legacy from store)
router.post('/skills', auth, (req, res) => {
    const { title, description, category, hours } = req.body;
    if (!title || !description || !category || !hours) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // We need to fetch full user info to attach to skill if store expects it
    sqliteDb.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err || !row) {
            // Fallback if db fail
            const newSkill = store.addUserSkill({
                title, description, category, hours,
                user: { username: req.user.username, name: req.user.username, online: true }
            });
            return res.status(201).json(newSkill);
        }

        const newSkill = store.addUserSkill({
            title, description, category, hours,
            user: {
                username: row.username,
                name: row.username, // mapping username to name for frontend compatibility
                avatar: row.avatar,
                online: true,
                id: row.id
            }
        });
        res.status(201).json(newSkill);
    });
});

// DELETE user skill (Legacy from store)
router.delete('/skills/:id', (req, res) => {
    const { id } = req.params;
    const deleted = store.deleteUserSkill(id);
    if (deleted) {
        res.json({ message: 'Skill deleted successfully' });
    } else {
        res.status(404).json({ message: 'Skill not found' });
    }
});

// PUT update user skill (Legacy from store)
router.put('/skills/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updated = store.updateUserSkill(id, updates);
    if (updated) {
        res.json(updated);
    } else {
        res.status(404).json({ message: 'Skill not found' });
    }
});

module.exports = router;
