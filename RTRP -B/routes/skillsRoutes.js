const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all skills (returns all user-created skills for browsing)
router.get('/', (req, res) => {
    // Join with users table to get creator details including online status
    const sql = `
        SELECT skills.*, 
               users.username as user_username, 
               users.email as user_email, 
               users.avatar as user_avatar,
               users.id as user_actual_id,
               users.is_online as user_online
        FROM skills
        JOIN users ON skills.user_id = users.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        // Format the response to match the shape expected by the frontend
        const skills = rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            category: row.category,
            hours: row.hours,
            user: {
                id: row.user_actual_id,
                username: row.user_username,
                email: row.user_email,
                avatar: row.user_avatar,
                online: row.user_online === 1 || row.user_online === true
            }
        }));

        res.json(skills);
    });
});

// GET skill by ID
router.get('/:id', (req, res) => {
    const sql = `
        SELECT skills.*, 
               users.username as user_username, 
               users.email as user_email, 
               users.avatar as user_avatar,
               users.id as user_actual_id,
               users.is_online as user_online
        FROM skills
        JOIN users ON skills.user_id = users.id
        WHERE skills.id = ?
    `;

    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        if (!row) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        const skill = {
            id: row.id,
            title: row.title,
            description: row.description,
            category: row.category,
            hours: row.hours,
            user: {
                id: row.user_actual_id,
                username: row.user_username,
                email: row.user_email,
                avatar: row.user_avatar,
                online: row.user_online === 1 || row.user_online === true
            }
        };

        res.json(skill);
    });
});

module.exports = router;
