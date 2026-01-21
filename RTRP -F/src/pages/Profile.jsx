import { useState, useEffect } from 'react';
import {
    MapPin, Calendar, Link as LinkIcon, Mail,
    Github, Twitter, Camera, Edit3,
    Clock, Zap, Star, ShieldCheck,
    Award, TrendingUp, Save, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
    const { currentUser, updateProfile, skills } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [avatarOptions, setAvatarOptions] = useState([]);
    const [selectedAvatarCategory, setSelectedAvatarCategory] = useState('General');

    const categoryStyles = {
        'General': { style: 'micah', color: 'e5e7eb' }, // Gray
        'Programming': { style: 'bottts', color: 'bae6fd' }, // Light Blue
        'Music': { style: 'avataaars', color: 'fbcfe8' }, // Light Pink
        'Design': { style: 'notionists', color: 'e9d5ff' }, // Light Purple
        'Academic': { style: 'miniavs', color: 'fde68a' }, // Light Amber
        'Language': { style: 'open-peeps', color: 'bbf7d0' }, // Light Green
    };

    useEffect(() => {
        if (currentUser) {
            setFormData({
                bio: currentUser.bio || '',
                role: currentUser.role || '',
                location: currentUser.location || '',
                website: currentUser.website || '',
                avatar: currentUser.avatar || ''
            });
        }
    }, [currentUser]);

    // Generate random avatar options based on category
    const generateAvatars = (category = selectedAvatarCategory) => {
        const { style, color } = categoryStyles[category];
        const seeds = Array.from({ length: 5 }, () => Math.random().toString(36).substring(7));

        // Note: Different styles accept different parameters, but generally this works for DiceBear
        const options = seeds.map(seed =>
            `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${color}`
        );
        setAvatarOptions(options);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        generateAvatars('General'); // Default start
    };

    // When category changes, regenerate
    useEffect(() => {
        if (isEditing) {
            generateAvatars(selectedAvatarCategory);
        }
    }, [selectedAvatarCategory]);

    const handleSave = async () => {
        const success = await updateProfile(formData);
        if (success) {
            setIsEditing(false);
        }
    };

    // Filter skills for this user
    // Note: The backend returns "skills" related to this user in a real app,
    // but here we filter the global skills list for simplicity as per current store structure.
    const myTeachSkills = skills.filter(s => s.user?.name === currentUser?.name || s.user?.username === currentUser?.username); // Fallback logic

    const stats = [
        { label: 'Time Credits', value: currentUser?.timeCredits || 0, icon: Clock, color: 'text-purple-400' },
        { label: 'Sessions', value: '0', icon: Zap, color: 'text-yellow-400' }, // Placeholder
        { label: 'Rating', value: 'New', icon: Star, color: 'text-green-400' }, // Placeholder
    ];

    if (!currentUser) return null;

    return (
        <div className="text-gray-100 font-sans animate-in fade-in duration-500">

            {/* --- Banner Section --- */}
            <div className="relative h-64 rounded-b-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-purple-900 to-blue-900 opacity-90"></div>
                <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80"
                    alt="Cover"
                    className="w-full h-full object-cover mix-blend-overlay opacity-50 transition-transform duration-700 group-hover:scale-105"
                />
                <button className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/10 flex items-center gap-2 opacity-0 group-hover:opacity-100">
                    <Camera size={16} /> Edit Cover
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6">

                {/* --- Header Profile Info --- */}
                <div className="relative -mt-20 mb-10 flex flex-col md:flex-row items-end gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-3xl p-1 bg-[#13111C] shadow-2xl overflow-hidden relative">
                            <img
                                src={isEditing ? formData.avatar : currentUser.avatar}
                                alt="Profile"
                                className="w-full h-full rounded-2xl object-cover bg-gray-800"
                            />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-white font-medium">Click on options below to change</span>
                                </div>
                            )}
                        </div>

                        {/* Avatar Options (Only in Edit Mode) */}
                        {/* Avatar Options (Only in Edit Mode) */}
                        {isEditing && (
                            <div className="absolute top-full left-0 mt-4 bg-[#13111C]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-20 w-max max-w-[340px] p-3">
                                {/* Category Tabs */}
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                                    {Object.keys(categoryStyles).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedAvatarCategory(cat)}
                                            className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all whitespace-nowrap ${selectedAvatarCategory === cat
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {avatarOptions.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setFormData({ ...formData, avatar: opt })}
                                            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${formData.avatar === opt ? 'border-purple-500 scale-110' : 'border-transparent hover:border-white/30'}`}
                                        >
                                            <img src={opt} alt={`Avatar option ${i}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => generateAvatars(selectedAvatarCategory)}
                                        className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 shrink-0"
                                        title="Refresh suggestions"
                                    >
                                        <Zap className="w-5 h-5 text-yellow-400" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Name & Bio */}
                    <div className="flex-1 pb-2 w-full">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-white">{currentUser.username}</h1>
                            <ShieldCheck className="w-5 h-5 text-blue-400" />
                        </div>

                        {isEditing ? (
                            <div className="space-y-3 mt-2 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                <input
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Role (e.g. Full Stack Developer)"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Location"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                    <input
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Website"
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-purple-300 font-medium mb-3">{currentUser.role || 'No role set'}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {currentUser.location || 'Unknown Location'}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> Joined {activeYear()}</span>
                                    <span className="flex items-center gap-1 text-blue-400 hover:underline cursor-pointer"><LinkIcon size={14} /> {currentUser.website || 'Add website'}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pb-2 self-start md:self-end mt-4 md:mt-0">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center gap-2"
                                >
                                    <Save size={18} /> Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2.5 bg-[#2a2a3e] border border-white/10 hover:bg-[#32324a] text-white rounded-xl transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="px-6 py-2.5 bg-[#2a2a3e] border border-white/10 hover:bg-[#32324a] text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                            >
                                <Edit3 size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* --- Grid Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

                    {/* LEFT COLUMN: Stats & About */}
                    <div className="space-y-6">

                        {/* Stats Cards Row */}
                        <div className="grid grid-cols-3 gap-3">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-[#1e1e2d]/60 backdrop-blur-md border border-white/5 p-3 rounded-2xl text-center hover:border-white/10 transition-colors">
                                    <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                                    <div className="text-xl font-bold text-white">{stat.value}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* About Me Card */}
                        <div className="bg-[#1e1e2d]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl h-fit">
                            <h3 className="text-white font-semibold mb-4 text-lg flex justify-between items-center">
                                About Me
                            </h3>
                            {isEditing ? (
                                <textarea
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 min-h-[120px]"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            ) : (
                                <p className="text-gray-400 leading-relaxed text-sm mb-6 whitespace-pre-wrap">
                                    {currentUser.bio || 'No bio yet. Click Edit Profile to add one!'}
                                </p>
                            )}

                            <div className="flex gap-3">
                                {[Github, Twitter, Mail].map((Icon, i) => (
                                    <button key={i} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Skills & Swap History */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Skills Container */}
                        <div className="bg-[#1e1e2d]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                                <Award className="w-4 h-4 text-purple-400" /> My Skills (Teaching)
                            </h3>
                            {myTeachSkills.length > 0 ? (
                                <div className="space-y-3">
                                    {myTeachSkills.map((skill) => (
                                        <div key={skill.id} className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                            <span className="font-medium text-purple-100">{skill.title}</span>
                                            <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-md">{skill.category}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                                    No skills listed yet. Go to "My Skills" to add some!
                                </div>
                            )}
                        </div>

                        {/* Learning (Demand) - Placeholder for now unless we add DB support */}
                        <div className="bg-[#1e1e2d]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl opacity-75">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-pink-400" /> Learning Goals
                                </h3>
                                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">Coming Soon</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                This section will track what you want to learn.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function activeYear() {
    return new Date().getFullYear();
}