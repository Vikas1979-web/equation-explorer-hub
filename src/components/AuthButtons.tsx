
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';

type AuthButtonsProps = {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
};

const AuthButtons: React.FC<AuthButtonsProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Force navigation to profile page with full URL
    window.location.href = '/profile';
  };

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleProfileClick}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onLogin}
        >
          <LogIn className="w-4 h-4" />
          <span>Sign in</span>
        </Button>
      )}
    </div>
  );
};

export default AuthButtons;
