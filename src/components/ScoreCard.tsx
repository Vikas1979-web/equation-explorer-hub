
import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  correct: number;
  total: number;
  avgTime?: number;
  className?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  correct, 
  total, 
  avgTime,
  className
}) => {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const formatTime = (seconds?: number): string => {
    if (!seconds) return '-';
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <div className={cn(
      "p-6 rounded-xl bg-white border border-border/60 shadow-sm animate-in",
      className
    )}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Correct</span>
            <span className="text-2xl font-semibold">{correct} / {total}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
            <span className={cn("text-2xl font-semibold", getColor())}>
              {percentage}%
            </span>
          </div>
        </div>
        
        {avgTime !== undefined && (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Avg. Time per Problem</span>
            <span className="text-2xl font-semibold">{formatTime(avgTime)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
