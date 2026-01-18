// In-memory data store (simulating a database)

// Mock seed data from frontend
const initialSkills = [
    {
        id: 1,
        title: 'Web Development',
        description: 'React, JavaScript, HTML/CSS fundamentals and modern frameworks',
        category: 'Programming',
        hours: 5,
        user: { id: 1, name: 'Alex Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', online: true },
    },
    {
        id: 2,
        title: 'Guitar Lessons',
        description: 'Beginner to intermediate acoustic guitar, music theory basics',
        category: 'Music',
        hours: 2,
        user: { id: 2, name: 'Sarah Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', online: true },
    },
    {
        id: 3,
        title: 'Video Editing',
        description: 'Adobe Premiere Pro, DaVinci Resolve, color grading, motion graphics',
        category: 'Design',
        hours: 3,
        user: { id: 3, name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', online: false },
    },
    {
        id: 4,
        title: 'Photography',
        description: 'Portrait photography, lighting techniques, composition rules',
        category: 'Design',
        hours: 4,
        user: { id: 4, name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', online: true },
    },
    {
        id: 5,
        title: 'Mathematics Tutoring',
        description: 'Calculus, Linear Algebra, Statistics for college students',
        category: 'Academic',
        hours: 6,
        user: { id: 5, name: 'David Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', online: false },
    },
    {
        id: 6,
        title: 'Graphic Design',
        description: 'Logo design, brand identity, Figma and Adobe Illustrator',
        category: 'Design',
        hours: 2,
        user: { id: 6, name: 'Lisa Wang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', online: true },
    },
];

const initialUser = {
    id: 0,
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
    online: true,
    timeCredits: 10,
    skills: ['Python Programming', 'Data Analysis'],
};

// State
let skills = [...initialSkills];
let currentUser = { ...initialUser };
let chats = {}; // { userId: [messages] }
let userSkills = [
    {
        id: 1,
        title: 'Python Programming',
        description: 'Beginner to advanced Python, including data structures, OOP, and basic ML concepts. Perfect for students starting their coding journey.',
        category: 'Programming',
        hours: 3,
        views: 24,
        requests: 5,
    },
    {
        id: 2,
        title: 'Data Analysis',
        description: 'Excel, SQL basics, and introduction to data visualization with charts and graphs. Great for business students.',
        category: 'Academic',
        hours: 2,
        views: 18,
        requests: 3,
    },
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
