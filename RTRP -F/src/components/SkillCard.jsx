import { Clock, MessageSquare, Video, Star, CheckCircle2 } from 'lucide-react';

export default function SkillCard({ skill, onChat, onVideo }) {
    // Destructure with defaults to prevent crashes
    const {
        title = 'Untitled Skill',
        description = 'No description provided.',
        category = 'General',
        hours = 1,
        rating = 'New',
        user = { name: 'Anonymous', online: false }
    } = skill;

    const categoryColors = {
        Programming: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        Music: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
        Design: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        Academic: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        Language: 'text-green-400 bg-green-400/10 border-green-400/20',
        General: 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    };

    const theme = categoryColors[category] || categoryColors.General;

    return (
        <div className="glass-card p-6 flex flex-col h-full relative group overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300">

            {/* --- Decorative Background Glow --- */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors duration-500"></div>

            {/* --- Header: User & Category --- */}
            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-gray-700 to-gray-800 group-hover:from-purple-500 group-hover:to-blue-500 transition-colors duration-300">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || user.username || 'User'}&background=random`}
                                alt={user.name || user.username}
                                className="w-full h-full rounded-full object-cover border-2 border-[#1e1e2d]"
                            />
                        </div>
                        {user.online && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#1e1e2d] rounded-full animate-pulse"></span>
                        )}
                    </div>

                    {/* Name & Status */}
                    <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1">
                            {user.name || user.username || 'Anonymous'}
                            {/* Simulated Verified Badge for visual trust */}
                            <CheckCircle2 className="w-3 h-3 text-blue-400" />
                        </h4>
                        <p className={`text-xs font-medium ${user.online ? 'text-green-400' : 'text-gray-500'}`}>
                            {user.online ? 'Online Now' : 'Offline'}
                        </p>
                    </div>
                </div>

                {/* Category Badge */}
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${theme}`}>
                    {category}
                </span>
            </div>

            {/* --- Body: Content --- */}
            <div className="flex-1 mb-5 relative z-10">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-1">
                    {title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {description}
                </p>
            </div>

            {/* --- Meta Data Row --- */}
            <div className="flex items-center justify-between py-3 mb-5 border-t border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-200">{hours} Credit{hours > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-white">{rating}</span>
                    <span className="text-xs text-gray-500">(12 reviews)</span>
                </div>
            </div>

            {/* --- Footer: Actions --- */}
            <div className="flex gap-3 mt-auto relative z-10">
                <button
                    onClick={() => onChat?.(skill)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 hover:border-white/10 transition-all text-sm font-medium"
                >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                </button>

                {user.online ? (
                    <button
                        onClick={() => onVideo?.(skill)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 transition-all text-sm font-bold transform active:scale-95"
                    >
                        <Video className="w-4 h-4" />
                        Start
                    </button>
                ) : (
                    <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed text-sm font-medium"
                    >
                        <Video className="w-4 h-4" />
                        Offline
                    </button>
                )}
            </div>
        </div>
    );
}