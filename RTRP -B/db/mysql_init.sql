-- Reset Database
-- WARNING: This will delete all existing data!
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS users;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    avatar TEXT,
    timeCredits INT DEFAULT 10,
    bio TEXT,
    role VARCHAR(255),
    location VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    hours DECIMAL(5,2),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Initial Users with password 'password123'
-- Hash: $2b$10$xNmiNeFApULX4DI3WL/Un.BUG4EwCgxxXr.Bin4wK2z5FV..cyAXO
INSERT INTO users (id, username, email, password, avatar) VALUES 
(1, 'gopu hardik', 'gopu@example.com', '$2b$10$xNmiNeFApULX4DI3WL/Un.BUG4EwCgxxXr.Bin4wK2z5FV..cyAXO', 'https://api.dicebear.com/7.x/notionists/svg?seed=c6bze&backgroundColor=e9d5ff'),
(2, 'testuser', 'test@example.com', '$2b$10$xNmiNeFApULX4DI3WL/Un.BUG4EwCgxxXr.Bin4wK2z5FV..cyAXO', 'https://api.dicebear.com/7.x/notionists/svg?seed=ws6m7h&backgroundColor=e9d5ff'),
(3, 'sreeja', 'sreeja@example.com', '$2b$10$xNmiNeFApULX4DI3WL/Un.BUG4EwCgxxXr.Bin4wK2z5FV..cyAXO', 'https://api.dicebear.com/7.x/miniavs/svg?seed=1gfhspc&backgroundColor=fde68a'),
(4, 'md. ali', 'ali@example.com', '$2b$10$xNmiNeFApULX4DI3WL/Un.BUG4EwCgxxXr.Bin4wK2z5FV..cyAXO', 'https://api.dicebear.com/7.x/notionists/svg?seed=vpw4v2x&backgroundColor=e9d5ff');

-- Seed Initial Skills
INSERT INTO skills (id, title, description, category, hours, user_id) VALUES 
(101, 'React.js Mentorship', 'I can help you master React hooks...', 'Programming', 2, 1),
(102, 'Vocal Training Basics', 'Learn breathing techniques...', 'Music', 1, 3),
(103, 'SQL Performance Tuning', 'Analyze your queries...', 'Programming', 3, 4),
(104, 'Digital Marketing 101', 'How to run your first FB ad campaign...', 'Academic', 1.5, 2),
(105, 'Piano for Kids', 'Fun and engaging piano lessons...', 'Music', 1, 3);
