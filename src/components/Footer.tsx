
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6 border-t border-border/50 mt-auto animate-fade-in">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
          <span className="font-medium text-sm">MathTrainer</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Designed for an elegant, focused learning experience
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MathTrainer
        </div>
      </div>
    </footer>
  );
};

export default Footer;
