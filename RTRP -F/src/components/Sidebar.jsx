import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard, Search, MessageSquare, BookOpen,
    User, Zap, LogOut, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
    const { currentUser, onlineUsers, logout } = useApp();

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/browse', icon: Search, label: 'Browse Skills' },
        { to: '/my-skills', icon: BookOpen, label: 'My Skills' },
        { to: '/messages', icon: MessageSquare, label: 'Messages' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <aside
            className={`
                fixed left-0 top-0 h-screen z-50
                bg-[#13111C]/95 backdrop-blur-2xl border-r border-white/5 
                flex flex-col shadow-2xl
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-20' : 'w-64'} 
            `}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-9 z-50 p-1.5 rounded-full bg-[#13111C] border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 shadow-lg transition-all transform hover:scale-110"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo Area */}
            <div className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'p-4 justify-center' : 'p-8 pb-6'}`}>
                <div className="relative shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-10 group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Zap className="w-6 h-6 text-white fill-white relative z-10" />
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">SkillSwap</h1>
                    <p className="text-[10px] font-medium text-purple-400 tracking-wider uppercase whitespace-nowrap">Beta v2.0</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-2 overflow-y-auto scrollbar-hide overflow-x-hidden">
                <p className={`px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 transition-all duration-300 ${isCollapsed ? 'text-center text-[10px]' : ''}`}>
                    {isCollapsed ? '---' : 'Menu'}
                </p>

                {navItems.map((item) => (
                    <div key={item.to} className="px-3">
                        <NavLink
                            to={item.to}
                            className={({ isActive }) => `
                                relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group overflow-hidden
                                ${isCollapsed ? 'justify-center' : ''}
                                ${isActive ? 'bg-white/5 text-white shadow-inner shadow-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <span className={`absolute bg-purple-500 rounded-r-full shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-300 ${isCollapsed ? 'left-0 top-1/4 h-1/2 w-1' : 'left-0 top-1/2 -translate-y-1/2 w-1 h-8'}`}></span>
                                    )}
                                    <item.icon className={`shrink-0 w-5 h-5 transition-colors duration-300 ${isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-300'}`} />
                                    <span className={`font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    </div>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-white/5 bg-[#0f0c18]/50">
                <div className={`rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 group ${isCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}>
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center mb-0' : 'mb-3'}`}>
                        <img src={currentUser.avatar} alt="User" className="shrink-0 w-10 h-10 rounded-full bg-gray-800 object-cover" />
                        <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                            <h4 className="text-sm font-bold text-white truncate">{currentUser.username || currentUser.name}</h4>
                            <p className="text-xs text-purple-400 font-medium truncate">{currentUser.timeCredits} hrs credits</p>
                        </div>
                    </div>
                    {/* Buttons hide on collapse */}
                    <div className={`grid grid-cols-2 gap-2 overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                        <Link to="/profile" className="flex items-center justify-center gap-2 p-2 rounded-lg bg-black/20 text-gray-400 hover:text-white transition-colors text-xs font-medium"><Settings className="w-3.5 h-3.5" />Settings</Link>
                        <button onClick={logout} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium"><LogOut className="w-3.5 h-3.5" />Logout</button>
                    </div>
                </div>
            </div>
        </aside>
    );
}