import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpRight, Sparkles, User, Clock, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SkillCard from '../components/SkillCard';
import ChatPanel from '../components/ChatPanel';
import VideoCall from '../components/VideoCall';

export default function BrowseSkills() {
    const { skills } = useApp();
    const [activeChat, setActiveChat] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    const categories = ['All', 'Programming', 'Music', 'Design', 'Academic', 'Language'];

    let filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
        const matchesOnline = !showOnlineOnly || skill.user.online;
        return matchesSearch && matchesCategory && matchesOnline;
    });

    // Sort skills
    if (sortBy === 'hours-low') {
        filteredSkills = [...filteredSkills].sort((a, b) => a.hours - b.hours);
    } else if (sortBy === 'hours-high') {
        filteredSkills = [...filteredSkills].sort((a, b) => b.hours - a.hours);
    }

    return (
        <div className="min-h-screen pb-8">
            {/* Header with gradient background */}
            <div className="relative mb-8 p-8 rounded-3xl overflow-hidden glass-card">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                        Browse Skills <Sparkles className="w-8 h-8 text-yellow-400" />
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl">
                        Discover thousands of skills from our community. Filter by category, find online tutors, and start trading time today.
                    </p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="sticky top-4 z-30 mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="What do you want to learn?"
                            className="w-full pl-12 pr-4 py-4 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 text-lg focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 shadow-xl"
                        />
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
                        <div className="flex items-center gap-3 px-4 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={showOnlineOnly}
                                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-colors ${showOnlineOnly ? 'bg-green-500' : 'bg-gray-700'}`}>
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${showOnlineOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                <span className={`text-sm font-medium ${showOnlineOnly ? 'text-white' : 'text-gray-400'}`}>Online Only</span>
                            </label>

                            <div className="w-px h-8 bg-white/10 mx-2"></div>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
                            >
                                <option value="newest" className="bg-gray-900">Newest First</option>
                                <option value="hours-low" className="bg-gray-900">Hours: Low to High</option>
                                <option value="hours-high" className="bg-gray-900">Hours: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categories Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                    ? 'bg-white text-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6 px-2">
                <p className="text-gray-400">
                    Showing <span className="text-white font-semibold">{filteredSkills.length}</span> results
                </p>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map(skill => (
                    <SkillCard
                        key={skill.id}
                        skill={skill}
                        onChat={setActiveChat}
                        onVideo={setActiveVideo}
                    />
                ))}
            </div>

            {filteredSkills.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 glass-card">
                    <div className="p-4 bg-white/5 rounded-full mb-4">
                        <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-white text-xl font-medium mb-2">No skills found</p>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setShowOnlineOnly(false); }}
                        className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Chat Panel */}
            {activeChat && (
                <ChatPanel
                    skill={activeChat}
                    onClose={() => setActiveChat(null)}
                />
            )}

            {/* Video Call */}
            {activeVideo && (
                <VideoCall
                    skill={activeVideo}
                    onClose={() => setActiveVideo(null)}
                />
            )}
        </div>
    );
}
