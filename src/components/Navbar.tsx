
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthButtons from './AuthButtons';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  
  const handleLogin = () => {
    // Mock login for now
    setIsLoggedIn(true);
    toast.success('Successfully signed in with Google');
  };
  
  const handleLogout = () => {
    // Mock logout for now
    setIsLoggedIn(false);
    toast.info('You have been logged out');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/70 backdrop-blur-md border-b border-border/50 animate-fade-in">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            M
          </div>
          <span className="font-medium text-lg tracking-tight">MathTrainer</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className={`navbar-item ${isActive('/') ? 'text-primary font-medium' : ''}`}>Practice</Link>
          <Link to="/leaderboard" className={`navbar-item ${isActive('/leaderboard') ? 'text-primary font-medium' : ''}`}>Leaderboard</Link>
          <AuthButtons 
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
