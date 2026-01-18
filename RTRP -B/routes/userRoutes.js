const express = require('express');
const router = express.Router();
const db = require('../data/store');

// GET current user
router.get('/', (req, res) => {
    const user = db.getUser();
    res.json(user);
});

// POST add credits
router.post('/credits/add', (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }
    const user = db.getUser();
    const updatedUser = db.updateUser({ timeCredits: user.timeCredits + amount });
    res.json(updatedUser);
});

// POST spend credits
router.post('/credits/spend', (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }
    const user = db.getUser();
    if (user.timeCredits < amount) {
        return res.status(400).json({ message: 'Insufficient credits' });
    }
    const updatedUser = db.updateUser({ timeCredits: user.timeCredits - amount });
    res.json(updatedUser);
});

// GET user skills
router.get('/skills', (req, res) => {
    const userSkills = db.getUserSkills();
    res.json(userSkills);
});

// POST add user skill
router.post('/skills', (req, res) => {
    const { title, description, category, hours } = req.body;
    if (!title || !description || !category || !hours) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const newSkill = db.addUserSkill({ title, description, category, hours });
    res.status(201).json(newSkill);
});

// DELETE user skill
router.delete('/skills/:id', (req, res) => {
    const { id } = req.params;
    const deleted = db.deleteUserSkill(id);
    if (deleted) {
        res.json({ message: 'Skill deleted successfully' });
    } else {
        res.status(404).json({ message: 'Skill not found' });
    }
});

// PUT update user skill
router.put('/skills/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateUserSkill(id, updates);
    if (updated) {
        res.json(updated);
    } else {
        res.status(404).json({ message: 'Skill not found' });
    }
});

module.exports = router;
