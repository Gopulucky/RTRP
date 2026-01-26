const db = require('./db/database');
const bcrypt = require('bcryptjs');

console.log('Verifying user password hash...');

setTimeout(() => {
    db.get("SELECT * FROM users WHERE email = ?", ['gopu@example.com'], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            process.exit(1);
        }
        if (!user) {
            console.error('User not found!');
            process.exit(1);
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const isMatch = bcrypt.compareSync('password123', user.password);
        if (isMatch) {
            console.log('SUCCESS: Password "password123" matches the stored hash.');
            process.exit(0);
        } else {
            console.error('FAILURE: Password "password123" does NOT match the stored hash.');
            process.exit(1);
        }
    });
}, 1000);
