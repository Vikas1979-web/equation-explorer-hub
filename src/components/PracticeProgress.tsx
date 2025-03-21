
import React from 'react';

interface PracticeProgressProps {
  currentProblemIndex: number;
  totalProblems: number;
  correctAnswers: number;
}

const PracticeProgress: React.FC<PracticeProgressProps> = ({
  currentProblemIndex,
  totalProblems,
  correctAnswers
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentProblemIndex) / totalProblems) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground mb-4">
        <div>Problem {currentProblemIndex + 1} of {totalProblems}</div>
        <div>{correctAnswers} Correct</div>
      </div>
    </div>
  );
};

export default PracticeProgress;
