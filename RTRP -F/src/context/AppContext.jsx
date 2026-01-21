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

    const fetchData = useCallback(async (token) => {
        if (!token) {
            token = localStorage.getItem('token');
        }
        if (!token) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            const [skillsRes, userRes, chatsRes] = await Promise.all([
                fetch(`${API_URL}/skills`).catch(err => ({ ok: false, error: err })),
                fetch(`${API_URL}/user`, { headers }).catch(err => ({ ok: false, error: err })),
                fetch(`${API_URL}/chats`).catch(err => ({ ok: false, error: err }))
            ]);

            const parseSafe = async (res) => {
                if (res.ok) return await res.json();
                return null;
            };

            const skillsData = await parseSafe(skillsRes);
            const userData = await parseSafe(userRes);
            const chatsData = await parseSafe(chatsRes);

            if (userData) {
                setCurrentUser(userData);
            } else {
                localStorage.removeItem('token');
                setCurrentUser(null);
            }

            setSkills(skillsData || []);
            setChats(chatsData || {});
            setOnlineUsers((skillsData || []).filter(s => s.user?.online));

        } catch (err) {
            console.error('Error fetching data:', err);
            setError("Failed to load data");
        } finally {
            setTimeout(() => setIsLoading(false), 800);
        }
    }, [API_URL]);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);
            // We fetch fresh data to ensure everything is synced
            await fetchData(data.token);

            showToast('Welcome back!', 'success');
            return true;
        } catch (err) {
            showToast(err.message, 'error');
            return false;
        }
    };

    const signup = async (username, email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);
            // We fetch fresh data to ensure everything is synced
            await fetchData(data.token);

            showToast('Account created successfully!', 'success');
            return true;
        } catch (err) {
            showToast(err.message, 'error');
            return false;
        }
    };

    const updateProfile = async (updates) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            const updatedUser = await res.json();
            if (!res.ok) throw new Error(updatedUser.message);

            setCurrentUser(updatedUser);
            showToast('Profile updated successfully!', 'success');
            return true;
        } catch (err) {
            showToast(err.message, 'error');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        showToast('Logged out successfully', 'info');
    };

    // Initial load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            // Optimistic update
            const tempId = Date.now();
            const newMessage = {
                id: tempId,
                text: message,
                sender: 'me',
                timestamp: new Date().toISOString()
            };

            setChats(prev => ({
                ...prev,
                [userId]: [...(prev[userId] || []), newMessage]
            }));

            // API Call
            const res = await fetch(`${API_URL}/chats/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Backend doesn't use auth yet
                },
                body: JSON.stringify({ text: message, sender: 'me' })
            });

            if (!res.ok) {
                // Revert on failure (omitted for simplicity, but good practice)
                throw new Error('Failed to send message');
            }

            // We could replace the temp ID with the real one if the backend returned it
        } catch (error) {
            console.error('Error sending message:', error);
            showToast("Failed to send message", "error");
        }
    };

    const addTimeCredits = async (hours) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/user/credits/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
        const token = localStorage.getItem('token');
        try {
            if (currentUser.timeCredits < hours) {
                showToast("Not enough credits!", "error");
                return false;
            }

            const res = await fetch(`${API_URL}/user/credits/spend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            login,
            signup,
            logout,
            updateProfile
        }}>
            {children}
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
