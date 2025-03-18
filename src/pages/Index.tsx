
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import MathProblem from '@/components/MathProblem';
import Timer from '@/components/Timer';
import ScoreCard from '@/components/ScoreCard';
import { 
  Difficulty, 
  Operation, 
  MathProblem as MathProblemType, 
  generateProblem, 
  getRandomOperation,
  getOperationSymbol
} from '@/utils/mathUtils';
import { ChevronDown, Check, Timer as TimerIcon, Brain, BarChart3 } from 'lucide-react';

const Index = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<MathProblemType | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [operations, setOperations] = useState<Operation[]>(['addition', 'subtraction', 'multiplication', 'division']);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [problemHistory, setProblemHistory] = useState<Array<{ problem: MathProblemType, isCorrect: boolean, time: number }>>([]);
  const [problemsToSolve, setProblemsToSolve] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [avgTime, setAvgTime] = useState<number | undefined>(undefined);

  // Generate a new problem
  const generateNewProblem = () => {
    const operation = operations.length > 0 
      ? operations[Math.floor(Math.random() * operations.length)]
      : 'addition';
    
    const newProblem = generateProblem(difficulty, operation);
    setCurrentProblem(newProblem);
  };

  // Start the session
  const handleStart = () => {
    setIsStarted(true);
    setIsComplete(false);
    setScore({ correct: 0, total: 0 });
    setProblemHistory([]);
    setAvgTime(undefined);
    generateNewProblem();
  };

  // Handle user's answer
  const handleAnswer = (correct: boolean, time: number) => {
    if (currentProblem) {
      setScore(prev => ({
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1
      }));
      
      setProblemHistory(prev => [
        ...prev, 
        { problem: currentProblem, isCorrect: correct, time }
      ]);
    }
  };

  // Handle moving to the next problem
  const handleNextProblem = () => {
    if (score.total >= problemsToSolve) {
      // Session is complete
      setIsComplete(true);
      setIsStarted(false);
      
      // Calculate average time
      if (problemHistory.length > 0) {
        const totalTime = problemHistory.reduce((sum, item) => sum + item.time, 0);
        setAvgTime(totalTime / problemHistory.length);
      }
    } else {
      // Move to next problem
      generateNewProblem();
    }
  };

  // Toggle operation selection
  const toggleOperation = (op: Operation) => {
    setOperations(prev => {
      if (prev.includes(op)) {
        // Don't allow removing the last operation
        if (prev.length === 1) return prev;
        return prev.filter(item => item !== op);
      } else {
        return [...prev, op];
      }
    });
  };

  // Reset to default settings
  const resetSettings = () => {
    setDifficulty('easy');
    setOperations(['addition', 'subtraction', 'multiplication', 'division']);
    setProblemsToSolve(10);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {!isStarted && !isComplete ? (
            <div className="flex flex-col items-center animate-fade-in text-center">
              <div className="w-16 h-16 mb-6 rounded-xl bg-primary text-white flex items-center justify-center text-2xl font-bold animate-float">
                M
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
                Master Mathematics with Precision
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mb-12 text-balance">
                Sharpen your math skills through elegant, focused practice.
                Solve problems at your own pace in a distraction-free environment.
              </p>
              
              <div className="w-full max-w-md mb-8">
                <div className="flex flex-col gap-6">
                  <Button 
                    onClick={handleStart} 
                    size="lg" 
                    className="w-full py-6 text-lg font-medium hover:shadow-lg hover:shadow-primary/10"
                  >
                    Start Practice
                  </Button>
                  
                  <Button 
                    onClick={() => setShowSettings(!showSettings)} 
                    variant="ghost" 
                    className="flex items-center justify-center gap-2"
                  >
                    Settings
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
              
              {showSettings && (
                <div className="w-full max-w-md p-6 rounded-xl bg-white border border-border/60 shadow-sm animate-fade-in">
                  <h3 className="text-lg font-medium mb-4">Practice Settings</h3>
                  
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                          <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
                              ${difficulty === level 
                                ? 'bg-primary text-white' 
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                              }`}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Operations</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {(['addition', 'subtraction', 'multiplication', 'division'] as Operation[]).map((op) => (
                          <button
                            key={op}
                            onClick={() => toggleOperation(op)}
                            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                              ${operations.includes(op) 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent'
                              }`}
                          >
                            {operations.includes(op) && <Check className="w-4 h-4" />}
                            {op.charAt(0).toUpperCase() + op.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Number of Problems</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[5, 10, 20].map((num) => (
                          <button
                            key={num}
                            onClick={() => setProblemsToSolve(num)}
                            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
                              ${problemsToSolve === num 
                                ? 'bg-primary text-white' 
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                              }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={resetSettings} 
                      variant="outline" 
                      size="sm"
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : isStarted && currentProblem ? (
            <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Problem {score.total + 1} of {problemsToSolve}</h2>
                    <p className="text-sm text-muted-foreground">
                      {currentProblem.difficulty.charAt(0).toUpperCase() + currentProblem.difficulty.slice(1)} • 
                      {currentProblem.operation.charAt(0).toUpperCase() + currentProblem.operation.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    <div className="text-lg font-semibold">
                      {score.correct} / {score.total}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TimerIcon className="w-5 h-5 text-muted-foreground" />
                    <Timer isRunning={isStarted} />
                  </div>
                </div>
              </div>
              
              <div className="max-w-xl mx-auto">
                <MathProblem
                  problem={currentProblem}
                  onAnswer={handleAnswer}
                  onNextProblem={handleNextProblem}
                  className="mb-8"
                />
              </div>
            </div>
          ) : isComplete ? (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Practice Complete</h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Well done! You've completed the practice session. Here's a summary of your performance.
                </p>
              </div>
              
              <div className="max-w-xl mx-auto mb-8">
                <ScoreCard 
                  correct={score.correct} 
                  total={score.total} 
                  avgTime={avgTime}
                  className="mb-6"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <Button onClick={handleStart}>
                    Practice Again
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowSettings(true);
                      setIsComplete(false);
                    }} 
                    variant="outline"
                  >
                    Change Settings
                  </Button>
                </div>
              </div>
              
              {problemHistory.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-4">Problem History</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {problemHistory.map((item, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                          item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white">
                            Problem {index + 1}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            item.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <div className="text-lg font-medium mb-1">
                          {item.problem.problem}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Answer: {item.problem.answer} • Time: {item.time.toFixed(1)}s
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
