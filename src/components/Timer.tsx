
import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ isRunning, onTimeUpdate, className = '' }) => {
  const [time, setTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time * 1000;
      
      const updateTimer = () => {
        if (!startTimeRef.current) return;
        
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTime(elapsedSeconds);
        
        if (onTimeUpdate) {
          onTimeUpdate(elapsedSeconds);
        }
      };
      
      timerRef.current = window.setInterval(updateTimer, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`font-mono text-xl ${className}`}>
      <span className={`transition-colors duration-300 ${isRunning ? 'text-primary' : 'text-muted-foreground'}`}>
        {formatTime(time)}
      </span>
    </div>
  );
};

export default Timer;
