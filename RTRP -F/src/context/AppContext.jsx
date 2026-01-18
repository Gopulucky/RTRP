import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Toast from '../components/Toast';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [chats, setChats] = useState({});
    const [activeChat, setActiveChat] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [activeVideo, setActiveVideo] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // New States for UI/UX
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null); // { message, type }

    const API_URL = 'http://localhost:5000/api';

    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
    }, []);

    const closeToast = useCallback(() => {
        setToast(null);
    }, []);

    // Fetch initial data with timeout and error handling
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            // Timeout promise to prevent infinite loading
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), 10000)
            );

            try {
                // Fetch each resource independently to avoid one failure blocking everything
                // We race against the timeout
                const [skillsRes, userRes, chatsRes] = await Promise.race([
                    Promise.all([
                        fetch(`${API_URL}/skills`).catch(err => ({ ok: false, error: err })),
                        fetch(`${API_URL}/user`).catch(err => ({ ok: false, error: err })),
                        fetch(`${API_URL}/chats`).catch(err => ({ ok: false, error: err }))
                    ]),
                    timeout
                ]);

                // Helper to safely parse JSON
                const parseSafe = async (res) => {
                    if (res.ok) return await res.json();
                    console.warn("Fetch failed for resource:", res.url || "unknown");
                    return null;
                };

                const skillsData = await parseSafe(skillsRes);
                const userData = await parseSafe(userRes);
                const chatsData = await parseSafe(chatsRes);

                // Critical data check
                if (!userData) {
                    throw new Error('Failed to load user profile. Is the server running?');
                }

                setSkills(skillsData || []);
                setCurrentUser(userData);
                setChats(chatsData || {});
                setOnlineUsers((skillsData || []).filter(s => s.user.online));

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || "Something went wrong connecting to the server.");
                showToast("Failed to connect to server", "error");
            } finally {
                // Add a small artificial delay to show off the fancy loading screen (optional, remove in prod if desired)
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        fetchData();
    }, [showToast]);

    // Simulate online status changes
    useEffect(() => {
        const interval = setInterval(() => {
            setSkills(prev => prev.map(skill => ({
                ...skill,
                user: {
                    ...skill.user,
                    online: Math.random() > 0.3
                }
            })));
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setOnlineUsers(skills.filter(s => s.user.online));
    }, [skills]);

    const sendMessage = async (userId, message) => {
        try {
            const res = await fetch(`${API_URL}/chats/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: message, sender: 'me' })
            });

            if (!res.ok) throw new Error('Failed to send');

            const newMessage = await res.json();

            setChats(prev => ({
                ...prev,
                [userId]: [...(prev[userId] || []), newMessage],
            }));

            // Simulate reply
            setTimeout(() => {
                const replies = [
                    "Sounds great! I'd love to trade skills with you.",
                    "That works for me. When are you available?",
                    "Perfect! Let's schedule a session.",
                    "I'm interested! Tell me more about what you can teach.",
                ];
                const replyMessage = {
                    id: Date.now(),
                    text: replies[Math.floor(Math.random() * replies.length)],
                    sender: 'them',
                    timestamp: new Date().toISOString(),
                };
                setChats(prev => ({
                    ...prev,
                    [userId]: [...(prev[userId] || []), replyMessage],
                }));
                showToast("New message received!", "info");
            }, 1000 + Math.random() * 2000);

        } catch (error) {
            console.error('Error sending message:', error);
            showToast("Failed to send message", "error");
        }
    };

    const addTimeCredits = async (hours) => {
        try {
            const res = await fetch(`${API_URL}/user/credits/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: hours })
            });
            if (!res.ok) throw new Error('Failed to add credits');

            const updatedUser = await res.json();
            setCurrentUser(updatedUser);
            showToast(`Added ${hours} hour(s) to your balance!`, "success");
        } catch (error) {
            console.error('Error adding credits:', error);
            showToast("Failed to add credits", "error");
        }
    };

    const spendTimeCredits = async (hours) => {
        try {
            if (currentUser.timeCredits < hours) {
                showToast("Not enough credits!", "error");
                return false;
            }

            const res = await fetch(`${API_URL}/user/credits/spend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: hours })
            });

            if (!res.ok) throw new Error('Failed to spend credits');

            const updatedUser = await res.json();
            setCurrentUser(updatedUser);
            showToast(`Spent ${hours} hour(s)`, "success");
            return true;
        } catch (error) {
            console.error('Error spending credits:', error);
            showToast("Transaction failed", "error");
            return false;
        }
    };

    if (isLoading) {
        return <LoadingScreen message="Connecting to the skill network..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Connection Error</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AppContext.Provider value={{
            currentUser,
            skills,
            chats,
            activeChat,
            setActiveChat,
            sendMessage,
            onlineUsers,
            addTimeCredits,
            spendTimeCredits,
            showToast,
        }}>
            {children}
            {/* Global Toast Container */}
            {toast && (
                <div className="fixed top-4 right-4 z-[60]">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={closeToast}
                    />
                </div>
            )}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
