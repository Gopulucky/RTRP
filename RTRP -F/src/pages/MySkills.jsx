import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Eye, Sparkles, BookOpen, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MySkills() {
    const { currentUser } = useApp();
    const [showAddForm, setShowAddForm] = useState(false);
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api';

    const [newSkill, setNewSkill] = useState({
        title: '',
        description: '',
        category: 'Programming',
        hours: 1,
    });

    const categories = ['Programming', 'Music', 'Design', 'Academic', 'Language'];

    const categoryColors = {
        Programming: 'from-blue-500 to-cyan-500',
        Music: 'from-pink-500 to-rose-500',
        Design: 'from-purple-500 to-violet-500',
        Academic: 'from-amber-500 to-orange-500',
        Language: 'from-green-500 to-emerald-500',
    };

    // Fetch user skills from backend
    useEffect(() => {
        const fetchUserSkills = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/user/skills`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const skillsData = await res.json();
                // Filter to only my skills (since endpoint currently returns all)
                // We check both username and name for compatibility with legacy/new data
                const myOwnSkills = skillsData.filter(s =>
                    s.user?.username === currentUser?.username ||
                    s.user?.name === currentUser?.username ||
                    s.user?.name === currentUser?.name
                );
                setMySkills(myOwnSkills);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user skills:', error);
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchUserSkills();
        }
    }, [currentUser]);

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (newSkill.title && newSkill.description) {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/user/skills`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newSkill)
                });
                const addedSkill = await res.json();
                setMySkills([...mySkills, addedSkill]);
                setNewSkill({ title: '', description: '', category: 'Programming', hours: 1 });
                setShowAddForm(false);
            } catch (error) {
                console.error('Error adding skill:', error);
            }
        }
    };

    const handleDeleteSkill = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/user/skills/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMySkills(mySkills.filter(skill => skill.id !== id));
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    const totalViews = mySkills.reduce((sum, skill) => sum + (skill.views || 0), 0);
    const totalRequests = mySkills.reduce((sum, skill) => sum + (skill.requests || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-8">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-purple-400" />
                            My Skills
                        </h1>
                        <p className="text-gray-400">
                            Showcase your expertise and start trading with the community.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Skill
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{mySkills.length}</p>
                        <p className="text-sm text-gray-400">Skills Listed</p>
                    </div>
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Eye className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{totalViews}</p>
                        <p className="text-sm text-gray-400">Total Views</p>
                    </div>
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                        <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{totalRequests}</p>
                        <p className="text-sm text-gray-400">Barter Requests</p>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Your Listed Skills</h2>
                <span className="text-sm text-gray-500">{mySkills.length} skill{mySkills.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mySkills.map(skill => (
                    <div key={skill.id} className="glass-card p-6 hover:border-purple-500/30 transition-all group">
                        {/* Header Row with User Info */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* User Avatar */}
                                <div className="relative">
                                    <img
                                        src={skill.user?.avatar || currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.username}&background=random`}
                                        alt={skill.user?.name || currentUser?.username}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30"
                                    />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1e1e2d] rounded-full"></span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                                            {skill.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r ${categoryColors[skill.category]} text-white`}>
                                            {skill.category}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{skill.user?.name || skill.user?.username || currentUser?.username}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                                <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteSkill(skill.id)}
                                    className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{skill.description}</p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span className="text-white font-medium">{skill.hours} hrs</span>
                                <span className="text-gray-500">to learn</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Eye className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-300">{skill.views} views</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300">{skill.requests} requests</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Skill Card */}
                <button
                    onClick={() => setShowAddForm(true)}
                    className="glass-card p-6 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-white/10 hover:border-purple-500/50 transition-all group cursor-pointer"
                >
                    <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-purple-500/20 transition-colors">
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <p className="text-gray-400 group-hover:text-white transition-colors font-medium">Add Another Skill</p>
                    <p className="text-gray-600 text-sm mt-1">Share your expertise</p>
                </button>
            </div>

            {mySkills.length === 0 && (
                <div className="text-center py-16 glass-card">
                    <div className="p-4 bg-purple-500/20 rounded-full w-fit mx-auto mb-4">
                        <Sparkles className="w-12 h-12 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No skills listed yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Start sharing your knowledge with the community. Add your first skill and begin trading time!
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                        Add Your First Skill
                    </button>
                </div>
            )}

            {/* Add Skill Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-8 w-full max-w-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Plus className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Add a New Skill</h2>
                        </div>
                        <form onSubmit={handleAddSkill} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Skill Title
                                </label>
                                <input
                                    type="text"
                                    value={newSkill.title}
                                    onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                                    placeholder="e.g., Guitar Lessons, React Development"
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newSkill.description}
                                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                                    placeholder="Describe what you can teach, your experience level, and what students will learn..."
                                    rows={4}
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 resize-none transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={newSkill.category}
                                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Hours to Learn
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={newSkill.hours}
                                        onChange={(e) => setNewSkill({ ...newSkill, hours: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-4 py-3.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                                >
                                    Add Skill
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
