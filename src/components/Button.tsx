
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className,
  disabled = false,
  type = 'button',
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-out";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90",
    outline: "border border-input bg-background hover:bg-secondary hover:text-secondary-foreground",
    ghost: "hover:bg-secondary hover:text-secondary-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";
  
  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
