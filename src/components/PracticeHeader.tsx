
import React from 'react';
import { ArrowLeft, Brain, Timer as TimerIcon } from 'lucide-react';
import Timer from '@/components/Timer';
import { Difficulty } from '@/utils/mathUtils';

interface PracticeHeaderProps {
  difficulty: Difficulty;
  timerRunning: boolean;
  onTimeUpdate: (time: number) => void;
  onGoBack: () => void;
}

const PracticeHeader: React.FC<PracticeHeaderProps> = ({
  difficulty,
  timerRunning,
  onTimeUpdate,
  onGoBack
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <button 
          onClick={onGoBack}
          className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-2xl font-bold tracking-tight">
          Practice Mode
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full text-sm">
          <Brain className="w-4 h-4 text-primary" />
          <span className="font-medium capitalize">{difficulty}</span>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full text-sm">
          <TimerIcon className="w-4 h-4 text-primary" />
          <Timer 
            isRunning={timerRunning} 
            onTimeUpdate={onTimeUpdate}
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeHeader;
