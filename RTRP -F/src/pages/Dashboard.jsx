import { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Zap, ArrowRight, Sparkles, Filter, ChevronRight, Activity, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SkillCard from '../components/SkillCard';
import ChatPanel from '../components/ChatPanel';
import VideoCall from '../components/VideoCall';

export default function Dashboard() {
    const { skills, onlineUsers, currentUser } = useApp();
    const [activeChat, setActiveChat] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [stats, setStats] = useState({ totalUsers: 0, totalSkills: 0, onlineUsers: 0 });
    const [members, setMembers] = useState([]);

    const categories = ['All', 'Programming', 'Music', 'Design', 'Academic', 'Language'];

    // Fetch community stats and members
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats');
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };

        const fetchMembers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/user/all');
                if (res.ok) {
                    const data = await res.json();
                    // Get latest members (limit to 4)
                    setMembers(data.slice(0, 4));
                }
            } catch (err) {
                console.error('Error fetching members:', err);
            }
        };

        fetchStats();
        fetchMembers();
    }, []);

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen animate-in fade-in duration-700">

            {/* --- TOP SECTION: Separation of "Me" (Left) and "Status" (Right) --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start gap-12 mb-16">

                {/* LEFT: The Welcome Hero */}
                <div className="flex-1 pt-4">
                    <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                                {stats.totalUsers} Members
                            </span>
                        </div>
                        <div className="w-px h-4 bg-white/20"></div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                                {stats.totalSkills} Skills
                            </span>
                        </div>
                        <div className="w-px h-4 bg-white/20"></div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                                {stats.onlineUsers} Online
                            </span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                        Learn faster, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x">
                            swap smarter.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-lg leading-relaxed mb-8">
                        Welcome back, {(currentUser.username || currentUser.name || 'User').split(' ')[0]}! Join {stats.totalUsers} members sharing skills on SkillSwap.
                    </p>

                    <Link to="/browse" className="group w-fit px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-purple-50 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Browse Marketplace
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* RIGHT: The "Wallet Monolith" */}
                <div className="w-full xl:w-[420px] flex flex-col gap-6">
                    {/* Primary Stat Card */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-bl from-[#2a2a40] to-[#161625] border border-white/10 p-8 shadow-2xl group hover:border-purple-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-purple-500/20 rounded-2xl">
                                    <Clock className="w-8 h-8 text-purple-400" />
                                </div>
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-gray-400">
                                    LIVE BALANCE
                                </span>
                            </div>

                            <div className="mb-2">
                                <span className="text-7xl font-bold text-white tracking-tighter">
                                    {currentUser.timeCredits}
                                </span>
                                <span className="text-2xl text-gray-500 ml-2">hrs</span>
                            </div>

                            <p className="text-sm text-gray-400 mb-6">
                                Use credits to learn new skills.
                            </p>

                            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-[70%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Mini-Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-3xl bg-[#1e1e2d]/40 border border-white/5 p-5 hover:bg-[#1e1e2d]/60 transition-colors">
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Skills</div>
                            <div className="text-2xl font-bold text-white flex items-center gap-2">
                                {stats.totalSkills} <Zap className="w-4 h-4 text-yellow-400" />
                            </div>
                        </div>
                        <div className="rounded-3xl bg-[#1e1e2d]/40 border border-white/5 p-5 hover:bg-[#1e1e2d]/60 transition-colors">
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Members</div>
                            <div className="text-2xl font-bold text-white flex items-center gap-2">
                                {stats.totalUsers} <TrendingUp className="w-4 h-4 text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE SECTION: The "Floating" Control Bar --- */}
            <div className="sticky top-6 z-40 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* FAR LEFT: Category Pills */}
                    <div className="p-2 bg-[#13111C]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl overflow-x-auto max-w-full md:max-w-2xl scrollbar-hide">
                        <div className="flex gap-1">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAR RIGHT: Search Input */}
                    <div className="w-full md:w-96 relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-5 py-4 bg-[#13111C]/80 backdrop-blur-2xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-xl"
                            placeholder="Find a skill..."
                        />
                    </div>
                </div>
            </div>

            {/* --- MEMBERS SECTION --- */}
            {members.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-end justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            New Members <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full font-mono">FRESH</span>
                        </h2>
                        <Link to="/browse" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {members.map(member => (
                            <div key={member.id} className="glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group cursor-pointer">
                                <div className="relative">
                                    <img
                                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.username}&background=random`}
                                        alt={member.username}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-purple-500/50 transition-colors"
                                    />
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#13111C] rounded-full"></div>
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-white font-bold truncate">{member.username}</h4>
                                    <p className="text-gray-500 text-xs truncate">{member.role || 'New Member'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- BOTTOM SECTION: The Content Grid --- */}
            <div className="space-y-8">
                <div className="flex items-end justify-between border-b border-white/5 pb-4">
                    <h2 className="text-3xl font-bold text-white">
                        Available Now
                    </h2>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-mono">{filteredSkills.length} RESULTS FOUND</span>
                    </div>
                </div>

                {filteredSkills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {filteredSkills.map((skill, index) => (
                            <div
                                key={skill.id}
                                className="transform hover:-translate-y-2 transition-transform duration-500 ease-out"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <SkillCard
                                    skill={skill}
                                    onChat={setActiveChat}
                                    onVideo={setActiveVideo}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center opacity-50">
                        <Filter className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-2xl font-bold text-white">No matches found</h3>
                        <p className="text-gray-400 mt-2">Try selecting "All" categories.</p>
                    </div>
                )}
            </div>

            {activeChat && <ChatPanel skill={activeChat} onClose={() => setActiveChat(null)} />}
            {activeVideo && <VideoCall skill={activeVideo} onClose={() => setActiveVideo(null)} />}
        </div>
    );
}