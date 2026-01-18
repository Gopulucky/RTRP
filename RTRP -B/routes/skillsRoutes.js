const express = require('express');
const router = express.Router();
const db = require('../data/store');

// GET all skills
router.get('/', (req, res) => {
    const skills = db.getSkills();
    res.json(skills);
});

// GET skill by ID
router.get('/:id', (req, res) => {
    const skill = db.getSkillById(req.params.id);
    if (!skill) {
        return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
});

module.exports = router;
