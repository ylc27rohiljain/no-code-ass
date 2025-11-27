import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Tags, Settings, LogOut, Menu, X, PlusCircle } from 'lucide-react';
import { api } from '../services/api';
import { Button } from './UI';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: PieChart, label: 'Reports', path: '/reports' },
    { icon: Tags, label: 'Categories', path: '/categories' },
  ];

  const user = api.getCurrentUser();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        {/* Logo now points to /login (Landing Page) as requested */}
        <Link to="/login" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
        </Link>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                ${isActive 
                  ? 'bg-primary-50 text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {user?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 fixed h-full z-20">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white z-30 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
         <Link to="/login" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800">FinTrack</h1>
        </Link>
        <button onClick={() => setIsMobileOpen(true)} className="p-2 text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-slide-in">
             <NavContent />
             <button onClick={() => setIsMobileOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400">
                <X size={20} />
             </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};