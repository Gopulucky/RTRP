const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const skillsRoutes = require('./routes/skillsRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/skills', skillsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/auth', authRoutes);

// Stats endpoint - returns community statistics
const db = require('./db/database');
const store = require('./data/store');

app.get('/api/stats', (req, res) => {
    // Get user count from SQLite
    db.get('SELECT COUNT(*) as userCount FROM users', [], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        const skills = store.getUserSkills();

        res.json({
            totalUsers: row?.userCount || 0,
            totalSkills: skills.length,
            onlineUsers: skills.filter(s => s.user?.online).length
        });
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
    res.send('RTRP Backend is running');
});



// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

