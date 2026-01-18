import { useState, useRef, useEffect } from 'react';
import { X, Send, Smile, Clock, Paperclip, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ChatPanel({ skill, onClose }) {
    const { chats, sendMessage } = useApp();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    const chatMessages = chats[skill.user.id] || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(skill.user.id, message);
            setMessage('');
        }
    };

    const quickMessages = [
        "I'd like to trade 2 hours of my skills for yours!",
        "What times work best for you?",
        "Can you tell me more about your teaching style?",
    ];

    return (
        <div className="fixed right-4 bottom-4 w-96 h-[600px] bg-[#1e1e2d]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col z-50 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={skill.user.avatar}
                            alt={skill.user.name}
                            className="w-10 h-10 rounded-full border border-white/10"
                        />
                        {skill.user.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e1e2d]"></span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{skill.user.name}</p>
                        <p className="text-xs text-purple-300 font-medium">{skill.title}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Trade Info Banner */}
            <div className="px-4 py-2 bg-purple-500/10 border-b border-white/5 flex items-center gap-2">
                <Clock className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-200">Trading for <span className="font-bold text-white">{skill.hours} hours</span> credit</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-300 font-medium mb-1">Start the conversation</p>
                        <p className="text-xs text-gray-500 mb-6 px-4">Negotiate terms, schedule a time, or ask questions.</p>

                        <div className="space-y-2">
                            {quickMessages.map((msg, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMessage(msg)}
                                    className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-purple-500/30"
                                >
                                    {msg}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${msg.sender === 'me'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm'
                                    : 'bg-white/10 text-gray-200 rounded-tl-sm'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                                    <p className="text-[10px]">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {msg.sender === 'me' && <CheckCheck className="w-3 h-3" />}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white/5 border-t border-white/10 rounded-b-2xl">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message..."
                            className="w-full pl-4 pr-10 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                        />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
