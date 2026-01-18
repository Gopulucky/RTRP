import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BrowseSkills from './pages/BrowseSkills';
import MySkills from './pages/MySkills';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import './index.css';

function App() {
  // 1. App controls the layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen text-gray-100 font-sans selection:bg-purple-500/30">

          {/* 2. Sidebar Component (Fixed Position) */}
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* 3. Main Content Container 
              - ml-64: Standard tailwind class for 16rem margin (matches sidebar width)
              - ml-20: Standard tailwind class for 5rem margin (matches collapsed sidebar)
          */}
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
              </Routes>
            </div>

          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;