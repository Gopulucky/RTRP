import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BrowseSkills from './pages/BrowseSkills';
import MySkills from './pages/MySkills';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OnboardingModal from './components/OnboardingModal';
import './index.css';

function MainLayout() {
  const { currentUser } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 font-sans selection:bg-purple-500/30">
      <OnboardingModal />

      {/* Sidebar Component (Fixed Position) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Container */}
      <main
        className={`
          relative min-h-screen flex flex-col
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}
        `}
      >
        {/* Page Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto p-6 md:p-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/browse" element={<BrowseSkills />} />
            <Route path="/my-skills" element={<MySkills />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            {/* Redirect unknown routes to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;