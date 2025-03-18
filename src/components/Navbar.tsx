
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
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
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/" className="navbar-item">Practice</Link>
          <Link to="/" className="navbar-item">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
