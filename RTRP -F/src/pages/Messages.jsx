import { useState } from 'react';
import { Search, Circle, CheckCheck, MoreVertical, Phone, Video, Send, Smile, Paperclip } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ChatPanel from '../components/ChatPanel';

export default function Messages() {
    const { skills, chats, currentUser } = useApp();
    const [activeChatSkill, setActiveChatSkill] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Get conversations (skills that have chat messages)
    // In a real app, this would be grouped by user, but here we group by skill offer for simplicity or user
    // Let's group by user ID to show one thread per user
    const chatUserIds = Object.keys(chats);

    // Find skill objects related to these users to display info
    const conversationUsers = chatUserIds.map(userId => {
        // Find a skill this user offers to display their info
        return skills.find(s => s.user.id.toString() === userId.toString());
    }).filter(Boolean); // Filter out any not found (shouldn't happen with mock data)

    // Combined list for display
    const displayConversations = conversationUsers.filter(skill =>
        skill.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Also show some "potential" chats/contacts
    const potentialContacts = skills.filter(skill =>
        !chatUserIds.includes(skill.user.id.toString()) &&
        skill.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getLastMessage = (userId) => {
        const userChats = chats[userId];
        if (!userChats || userChats.length === 0) return null;
        return userChats[userChats.length - 1];
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString();
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                {/* Header */}
                <div className="glass-card p-4">
                    <h1 className="text-xl font-bold text-white mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 glass-card overflow-y-auto p-2 scrollbar-hide">
                    {displayConversations.length > 0 && (
                        <>
                            <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Active</h2>
                            {displayConversations.map(skill => {
                                const lastMsg = getLastMessage(skill.user.id);
                                const isActive = activeChatSkill?.user.id === skill.user.id;

                                return (
                                    <button
                                        key={skill.user.id}
                                        onClick={() => setActiveChatSkill(skill)}
                                        className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all mb-1 ${isActive
                                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                                            : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={skill.user.avatar}
                                                alt={skill.user.username}
                                                className="w-12 h-12 rounded-full bg-gray-700 object-cover"
                                            />
                                            {skill.user.online && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-200'}`}>{skill.user.username}</p>
                                                {lastMsg && (
                                                    <span className="text-[10px] text-gray-500">{formatTime(lastMsg.timestamp)}</span>
                                                )}
                                            </div>
                                            {lastMsg ? (
                                                <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                                                    {lastMsg.sender === 'me' && <CheckCheck className="w-3 h-3 text-purple-400" />}
                                                    {lastMsg.text}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-purple-400">Draft</p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </>
                    )}

                    {potentialContacts.length > 0 && (
                        <>
                            <h2 className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested</h2>
                            {potentialContacts.slice(0, 5).map(skill => (
                                <button
                                    key={skill.id}
                                    onClick={() => setActiveChatSkill(skill)}
                                    className="w-full p-3 flex items-center gap-3 rounded-xl hover:bg-white/5 border border-transparent transition-all mb-1"
                                >
                                    <div className="relative gray-scale contrast-125">
                                        <img
                                            src={skill.user.avatar}
                                            alt={skill.user.username}
                                            className="w-10 h-10 rounded-full bg-gray-700 opacity-80"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-medium text-gray-300">{skill.user.username}</p>
                                        <p className="text-xs text-gray-500 truncate">{skill.title}</p>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 glass-card overflow-hidden flex flex-col relative">
                {activeChatSkill ? (
                    <>
                        {/* Navigation Header (embedded chat) */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <img
                                    src={activeChatSkill.user.avatar}
                                    alt={activeChatSkill.user.username}
                                    className="w-10 h-10 rounded-full bg-gray-700"
                                />
                                <div>
                                    <h2 className="text-white font-semibold">{activeChatSkill.user.username}</h2>
                                    <div className="flex items-center gap-2 text-xs">
                                        {activeChatSkill.user.online ? (
                                            <span className="text-green-400 flex items-center gap-1">● Online</span>
                                        ) : (
                                            <span className="text-gray-500">Offline</span>
                                        )}
                                        <span className="text-gray-600">•</span>
                                        <span className="text-gray-400">{activeChatSkill.title}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Reuse ChatPanel logic just for rendering/sending?
                Actually, ChatPanel was designed as a sidebar overlay. 
                Let's reuse the ChatPanel component but maybe we can modify it or 
                just use it as is if it fits, OR simpler: just render the logic here 
                since we want a full-screen-ish experience. 
                
                For simplicity and consistency, let's wrap the ChatPanel's inner content logic here directly.
                Or even better, we use the existing ChatPanel but css-hack it to be relative 
                Wait, ChatPanel is fixed positioned. Let's rewrite a dedicated embedded chat view here.
             */}
                        <div className="flex-1 relative">
                            {/* We can just render the ChatPanel as part of this view if we modify ChatPanel to accept a className? 
                    Or just duplicate the chat aesthetic here for the full page view. Duplicating is safer to avoid breaking the overlay version.
                */}
                            <EmbeddedChat skill={activeChatSkill} />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 opacity-50 ml-1" />
                        </div>
                        <p className="text-lg font-medium text-white">Select a conversation</p>
                        <p className="text-sm">Choose a contact to start trading skills</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Internal component for the full-view chat to avoid code dup complex logic if possible, 
// but essentially it's the same visual logic as ChatPanel
function EmbeddedChat({ skill }) {
    const { chats, sendMessage } = useApp();
    const [message, setMessage] = useState('');

    const chatMessages = chats[skill.user.id] || [];

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(skill.user.id, message);
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p>No messages yet. Say hello!</p>
                    </div>
                )}
                {chatMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] px-5 py-3 rounded-2xl ${msg.sender === 'me'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm'
                            : 'bg-white/10 text-gray-200 rounded-tl-sm'
                            }`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className="text-[10px] mt-1 opacity-70 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
                <form onSubmit={handleSend} className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5 focus-within:border-purple-500/50 transition-colors">
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                    />
                    <button type="button" className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                        <Smile className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="p-2 bg-white/10 text-white rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:hover:bg-white/10"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
