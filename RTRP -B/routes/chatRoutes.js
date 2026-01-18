const express = require('express');
const router = express.Router();
const db = require('../data/store');

// GET all chats
router.get('/', (req, res) => {
    const allChats = db.getAllChats();
    res.json(allChats);
});

// GET chats for a specific user interaction
router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    const messages = db.getChats(userId);
    res.json(messages);
});

// POST send message
router.post('/:userId', (req, res) => {
    const { userId } = req.params;
    const { text, sender } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Message text is required' });
    }

    const newMessage = {
        id: Date.now(),
        text,
        sender: sender || 'me',
        timestamp: new Date().toISOString()
    };

    const updatedChat = db.addMessage(userId, newMessage);
    res.json(newMessage);
});

module.exports = router;
