import { useState } from 'react';
import {
    MapPin, Calendar, Link as LinkIcon, Mail,
    Github, Twitter, Camera, Edit3,
    Clock, Zap, Star, ShieldCheck,
    Award, TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
    const { currentUser } = useApp();

    // Mock data - In real app, this comes from your backend
    const [profile] = useState({
        name: 'Alex Chen',
        username: '@alexcodes',
        role: 'Full Stack Developer',
        location: 'San Francisco, CA',
        joined: 'September 2025',
        website: 'alexchen.dev',
        bio: 'Trading React knowledge for Guitar lessons. Obsessed with clean code and jazz improvisation. Let\'s swap skills!',
        isOnline: true,
        skills: [
            { name: 'React', level: 'Expert', type: 'teach' },
            { name: 'Node.js', level: 'Advanced', type: 'teach' },
            { name: 'TypeScript', level: 'Advanced', type: 'teach' }
        ],
        learning: [
            { name: 'Guitar', priority: 'High', type: 'learn' },
            { name: 'Spanish', priority: 'Medium', type: 'learn' }
        ]
    });

    const stats = [
        { label: 'Time Credits', value: '10', icon: Clock, color: 'text-purple-400' },
        { label: 'Sessions', value: '12', icon: Zap, color: 'text-yellow-400' },
        { label: 'Rating', value: '4.9', icon: Star, color: 'text-green-400' },
    ];

    return (
        <div className="text-gray-100 font-sans">

            {/* --- Banner Section --- */}
            <div className="relative h-64 rounded-b-3xl overflow-hidden">
                {/* Gradient Background matching your dashboard vibe */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-purple-900 to-blue-900 opacity-90"></div>
                <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80"
                    alt="Cover"
                    className="w-full h-full object-cover mix-blend-overlay opacity-50"
                />
                <button className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/10 flex items-center gap-2">
                    <Camera size={16} /> Edit Cover
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6">

                {/* --- Header Profile Info --- */}
                <div className="relative -mt-20 mb-10 flex flex-col md:flex-row items-end gap-6">
                    {/* Avatar with Status Dot */}
                    <div className="relative">
                        <div className="w-40 h-40 rounded-3xl p-1 bg-[#13111C] shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80"
                                alt="Profile"
                                className="w-full h-full rounded-2xl object-cover"
                            />
                        </div>
                        {profile.isOnline && (
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-[#13111C] rounded-full"></div>
                        )}
                    </div>

                    {/* Name & Bio */}
                    <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                            <ShieldCheck className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-purple-300 font-medium mb-3">{profile.role}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> Joined {profile.joined}</span>
                            <span className="flex items-center gap-1 text-blue-400 hover:underline cursor-pointer"><LinkIcon size={14} /> {profile.website}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pb-2">
                        <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20">
                            Message
                        </button>
                        <button className="px-4 py-2.5 bg-[#2a2a3e] border border-white/10 hover:bg-[#32324a] text-white rounded-xl transition-all">
                            <Edit3 size={18} />
                        </button>
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
                        <div className="bg-[#1e1e2d]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
                            <h3 className="text-white font-semibold mb-4 text-lg">About Me</h3>
                            <p className="text-gray-400 leading-relaxed text-sm mb-6">
                                {profile.bio}
                            </p>
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
                            <div className="grid md:grid-cols-2 gap-8">

                                {/* Teaching (Supply) */}
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                                        <Award className="w-4 h-4 text-purple-400" /> I Can Teach
                                    </h3>
                                    <div className="space-y-3">
                                        {profile.skills.map((skill, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                                <span className="font-medium text-purple-100">{skill.name}</span>
                                                <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-md">{skill.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Learning (Demand) */}
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-pink-400" /> I Want to Learn
                                    </h3>
                                    <div className="space-y-3">
                                        {profile.learning.map((skill, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                                                <span className="font-medium text-pink-100">{skill.name}</span>
                                                <span className="text-xs text-pink-300 bg-pink-500/20 px-2 py-1 rounded-md">{skill.priority} Priority</span>
                                            </div>
                                        ))}
                                        <button className="w-full py-3 border border-dashed border-gray-700 text-gray-500 rounded-xl text-sm hover:border-gray-500 hover:text-white transition-all">
                                            + Add Learning Goal
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Recent Swaps / Activity */}
                        <div className="bg-[#1e1e2d]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Recent Swaps</h3>
                            </div>
                            <div className="space-y-4">
                                {/* Activity Item 1 */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                                    <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                                        <Award size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">Taught React Hooks</h4>
                                        <p className="text-sm text-gray-400">to <span className="text-gray-200">Sarah Kim</span> • Earned 2 Credits</p>
                                    </div>
                                    <span className="text-xs text-gray-500">2 days ago</span>
                                </div>

                                {/* Activity Item 2 */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                                    <div className="p-3 rounded-full bg-pink-500/20 text-pink-400">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">Learned Guitar Chords</h4>
                                        <p className="text-sm text-gray-400">from <span className="text-gray-200">Mike J.</span> • Spent 1 Credit</p>
                                    </div>
                                    <span className="text-xs text-gray-500">5 days ago</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}