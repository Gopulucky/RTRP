const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // If no token, we might want to allow optional auth for some routes, but for /user we need it.
    // For now, strict auth.
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // { id, username }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;
