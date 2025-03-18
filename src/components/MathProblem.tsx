
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem as MathProblemType, Difficulty, Operation, checkAnswer } from '@/utils/mathUtils';
import Button from './Button';
import { cn } from '@/lib/utils';

interface MathProblemProps {
  problem: MathProblemType;
  onAnswer: (correct: boolean, time: number) => void;
  onNextProblem: () => void;
  className?: string;
}

const MathProblem: React.FC<MathProblemProps> = ({
  problem,
  onAnswer,
  onNextProblem,
  className,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset when problem changes
    setUserAnswer('');
    setAnswered(false);
    setIsCorrect(null);
    setStartTime(Date.now());
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem]);

  // Effect to automatically move to next problem if answer is correct
  useEffect(() => {
    if (answered && isCorrect) {
      const timer = setTimeout(() => {
        onNextProblem();
      }, 300); // Reduced from 800ms to 300ms for faster transition
      
      return () => clearTimeout(timer);
    }
  }, [answered, isCorrect, onNextProblem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (answered || !userAnswer) return;
    
    const userNumAnswer = parseFloat(userAnswer);
    const isAnswerCorrect = checkAnswer(userNumAnswer, problem.answer, problem.difficulty);
    const elapsedTime = (Date.now() - startTime) / 1000;
    
    setIsCorrect(isAnswerCorrect);
    setAnswered(true);
    onAnswer(isAnswerCorrect, elapsedTime);
    
    // If answer is incorrect, clear the input and keep focus
    if (!isAnswerCorrect) {
      setUserAnswer('');
      setTimeout(() => {
        setAnswered(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 800); // Keeping this at 800ms to give enough time to see the incorrect feedback
    }
  };

  const handleNext = () => {
    onNextProblem();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // When Enter is pressed and the problem is already answered, go to next problem
    if (e.key === 'Enter' && answered && isCorrect) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className={cn(
      "problem-card p-6 animate-in transition-all duration-300",
      answered ? (isCorrect ? "border-2 border-green-200" : "border-2 border-red-200") : "",
      className
    )}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </div>
          <div className="text-3xl md:text-4xl font-medium tracking-tight">
            {problem.problem}
          </div>
        </div>
        
        <div className="relative">
          <input
            ref={inputRef}
            type="number"
            step="any"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={answered && isCorrect}
            className={cn(
              "glass-input w-full py-3 px-4 rounded-lg text-center text-xl transition-all duration-300",
              answered && (isCorrect 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-red-50 border-red-200 text-red-700")
            )}
            placeholder="Your answer"
            autoFocus
          />
          
          {answered && (
            <div className={cn(
              "absolute right-3 top-3 text-sm px-2 py-1 rounded animate-fade-in",
              isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}>
              {isCorrect ? "Correct" : "Incorrect"}
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          {!answered ? (
            <Button 
              type="submit"
              disabled={!userAnswer}
              className="min-w-32"
            >
              Check Answer
            </Button>
          ) : (
            <div className="flex flex-col w-full gap-4">
              {!isCorrect && (
                <div className="text-center text-lg font-medium text-muted-foreground">
                  Correct answer: <span className="text-foreground">{problem.answer}</span>
                </div>
              )}
              {isCorrect && (
                <div className="text-center text-sm text-muted-foreground">
                  Moving to next problem...
                </div>
              )}
              {!isCorrect && (
                <Button 
                  onClick={handleNext}
                  className="mx-auto min-w-32"
                >
                  Skip to Next Problem
                </Button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MathProblem;
