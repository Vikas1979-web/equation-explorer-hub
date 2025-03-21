
import React from 'react';
import { CheckCircle } from 'lucide-react';
import ScoreCard from '@/components/ScoreCard';
import { Button } from '@/components/ui/button';

interface PracticeCompleteProps {
  correctAnswers: number;
  totalProblems: number;
  averageTime: number;
  onStartNewPractice: () => void;
  onViewProfile: () => void;
}

const PracticeComplete: React.FC<PracticeCompleteProps> = ({
  correctAnswers,
  totalProblems,
  averageTime,
  onStartNewPractice,
  onViewProfile
}) => {
  return (
    <div className="animate-in fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600 mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Practice Complete!</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Great job! You've completed your practice session. Here's how you did:
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto mb-10">
        <ScoreCard 
          correct={correctAnswers} 
          total={totalProblems}
          avgTime={averageTime}
        />
        
        <div className="flex flex-col gap-4">
          <Button onClick={onStartNewPractice} size="lg">
            Start New Practice
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onViewProfile}
          >
            View Your Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeComplete;
