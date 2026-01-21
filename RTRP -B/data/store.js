// In-memory data store (simulating a database)

// No demo skills - only user-entered skills will appear
const initialSkills = [];

const initialUser = {
    id: 0,
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
    online: true,
    timeCredits: 10,
    skills: [],
};

// State
let skills = [...initialSkills];
let currentUser = { ...initialUser };
let chats = {}; // { userId: [messages] }
let userSkills = [
    {
        id: 101,
        title: "React.js Mentorship",
        description: "I can help you master React hooks, context, and state management. Happy to look at your code and debug together.",
        category: "Programming",
        hours: 2,
        user: { id: 1, username: 'gopu hardik', name: 'gopu hardik', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=c6bze&backgroundColor=e9d5ff', online: true }
    },
    {
        id: 102,
        title: "Vocal Training Basics",
        description: "Learn breathing techniques and basic scales to improve your singing voice. Beginners welcome!",
        category: "Music",
        hours: 1,
        user: { id: 3, username: 'sreeja', name: 'sreeja', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1gfhspc&backgroundColor=fde68a', online: false }
    },
    {
        id: 103,
        title: "SQL Performance Tuning",
        description: "Analyze your queries and indexes to speed up your database. I have 5 years of experience with PostgreSQL and SQLite.",
        category: "Programming",
        hours: 3,
        user: { id: 4, username: 'md. ali', name: 'md. ali', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=vpw4v2x&backgroundColor=e9d5ff', online: true }
    },
    {
        id: 104,
        title: "Digital Marketing 101",
        description: "How to run your first FB ad campaign and track ROI properly.",
        category: "Academic",
        hours: 1.5,
        user: { id: 2, username: 'testuser', name: 'testuser', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ws6m7h&backgroundColor=e9d5ff', online: true }
    },
    {
        id: 105,
        title: "Piano for Kids",
        description: "Fun and engaging piano lessons for children. We start with simple songs to build confidence.",
        category: "Music",
        hours: 1,
        user: { id: 3, username: 'sreeja', name: 'sreeja', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1gfhspc&backgroundColor=fde68a', online: false }
    }
];

const db = {
    getSkills: () => skills,
    getSkillById: (id) => skills.find(s => s.id === parseInt(id)),
    getUser: () => currentUser,
    updateUser: (updates) => {
        currentUser = { ...currentUser, ...updates };
        return currentUser;
    },
    getChats: (userId) => chats[userId] || [],
    addMessage: (userId, message) => {
        if (!chats[userId]) chats[userId] = [];
        chats[userId].push(message);
        return chats[userId];
    },
    getAllChats: () => chats,
    getUserSkills: () => userSkills,
    addUserSkill: (skill) => {
        const newSkill = {
            ...skill,
            id: skill.id || Date.now(),
            views: skill.views || 0,
            requests: skill.requests || 0,
        };
        userSkills.push(newSkill);
        return newSkill;
    },
    deleteUserSkill: (id) => {
        const index = userSkills.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            userSkills.splice(index, 1);
            return true;
        }
        return false;
    },
    updateUserSkill: (id, updates) => {
        const index = userSkills.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            userSkills[index] = { ...userSkills[index], ...updates };
            return userSkills[index];
        }
        return null;
    }
};

module.exports = db;
