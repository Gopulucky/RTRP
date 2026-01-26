const db = require('./db/database');

console.log('Testing MySQL connection and querying skills...');

setTimeout(() => {
    // Test getting all skills
    db.all('SELECT * FROM skills', [], (err, rows) => {
        if (err) {
            console.error('Error querying skills:', err);
            process.exit(1);
        }
        console.log(`Found ${rows.length} skills in the database.`);
        if (rows.length > 0) {
            console.log('Sample skill:', rows[0].title);
        } else {
            console.log('No skills found. Seeding might have failed or table is empty.');
        }

        // Test getting users
        db.all('SELECT * FROM users', [], (err, uRows) => {
            if (err) {
                console.error('Error querying users:', err);
                process.exit(1);
            }
            console.log(`Found ${uRows.length} users in the database.`);
            process.exit(0);
        });
    });
}, 1000); // Wait bit for connection pool to init
