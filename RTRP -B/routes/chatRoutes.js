const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

// GET all chats for current user
router.get('/', auth, (req, res) => {
    const userId = req.user.id;

    // Get all unique conversations for this user
    db.all(`
        SELECT DISTINCT 
            CASE 
                WHEN sender_id = ? THEN receiver_id 
                ELSE sender_id 
            END as other_user_id
        FROM messages 
        WHERE sender_id = ? OR receiver_id = ?
    `, [userId, userId, userId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        // Format as object with user IDs as keys
        const chats = {};
        if (rows && rows.length > 0) {
            const userIds = rows.map(r => r.other_user_id);

            // Get messages for each conversation
            let completed = 0;
            userIds.forEach(otherUserId => {
                db.all(`
                    SELECT id, sender_id, receiver_id, text, created_at as timestamp
                    FROM messages 
                    WHERE (sender_id = ? AND receiver_id = ?) 
                       OR (sender_id = ? AND receiver_id = ?)
                    ORDER BY created_at ASC
                `, [userId, otherUserId, otherUserId, userId], (err, messages) => {
                    completed++;
                    if (!err && messages) {
                        chats[otherUserId] = messages.map(m => ({
                            id: m.id,
                            text: m.text,
                            sender: m.sender_id === userId ? 'me' : 'them',
                            timestamp: m.timestamp
                        }));
                    }

                    if (completed === userIds.length) {
                        res.json(chats);
                    }
                });
            });
        } else {
            res.json(chats);
        }
    });
});

// GET chats for a specific user interaction
router.get('/:userId', auth, (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    db.all(`
        SELECT id, sender_id, receiver_id, text, created_at as timestamp
        FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) 
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
    `, [currentUserId, userId, userId, currentUserId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        const messages = (rows || []).map(m => ({
            id: m.id,
            text: m.text,
            sender: m.sender_id === currentUserId ? 'me' : 'them',
            timestamp: m.timestamp
        }));

        res.json(messages);
    });
});

// POST send message
router.post('/:userId', auth, (req, res) => {
    const { userId } = req.params;
    const { text } = req.body;
    const senderId = req.user.id;

    if (!text) {
        return res.status(400).json({ message: 'Message text is required' });
    }

    db.run(
        'INSERT INTO messages (sender_id, receiver_id, text) VALUES (?, ?, ?)',
        [senderId, userId, text],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }

            const newMessage = {
                id: this.lastID,
                text,
                sender: 'me',
                timestamp: new Date().toISOString()
            };

            res.json(newMessage);
        }
    );
});

module.exports = router;
