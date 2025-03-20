
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MathProblem from '@/components/MathProblem';
import ScoreCard from '@/components/ScoreCard';
import Timer from '@/components/Timer';
import { Button } from '@/components/ui/button';
import { generateMathProblem, MathProblem as MathProblemType, Difficulty } from '@/utils/mathUtils';
import { ArrowLeft, CheckCircle, Brain, Timer as TimerIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Practice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Practice state
  const [problems, setProblems] = useState<MathProblemType[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  
  // Difficulty settings
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [problemCount, setProblemCount] = useState(5);
  
  // Performance tracking
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answerTimes, setAnswerTimes] = useState<number[]>([]);
  
  // Get current problem
  const currentProblem = problems[currentProblemIndex];
  
  // Calculate scores
  const averageTime = answerTimes.length > 0 
    ? answerTimes.reduce((sum, time) => sum + time, 0) / answerTimes.length 
    : 0;

  // Generate problems based on settings
  const generateProblems = useCallback(() => {
    const newProblems = Array(problemCount)
      .fill(null)
      .map(() => generateMathProblem(difficulty));
    
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setTimerRunning(true);
    setPracticeComplete(false);
    setCorrectAnswers(0);
    setAnswerTimes([]);
  }, [difficulty, problemCount]);
  
  // Initialize practice when component mounts
  useEffect(() => {
    generateProblems();
  }, [generateProblems]);
  
  // Handle user answer
  const handleAnswer = async (correct: boolean, time: number) => {
    // Track correct answers
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Track answer time
    setAnswerTimes(prev => [...prev, time]);
    
    // Store the result in Supabase if user is logged in
    if (user) {
      try {
        await supabase.from('practice_results').insert({
          user_id: user.id,
          problem: currentProblem.problem,
          answer: currentProblem.answer,
          user_answer: correct ? currentProblem.answer : null, // Simplification, ideally store actual user answer
          is_correct: correct,
          time_taken: time,
          difficulty: difficulty
        });
      } catch (error) {
        console.error('Error saving practice result:', error);
        // Continue anyway - don't disrupt the user experience
      }
    }
  };
  
  // Move to next problem
  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    } else {
      // Practice complete
      setTimerRunning(false);
      setPracticeComplete(true);
      
      // Save session summary to Supabase if user is logged in
      if (user) {
        savePracticeSession();
      }
    }
  };
  
  // Save practice session summary to Supabase
  const savePracticeSession = async () => {
    try {
      const { error } = await supabase.from('practice_sessions').insert({
        user_id: user!.id,
        difficulty,
        total_problems: problems.length,
        correct_answers: correctAnswers,
        total_time: totalTime,
        average_time: averageTime
      });
      
      if (error) throw error;
      
      // Update user's practice streak
      updatePracticeStreak();
      
      toast.success('Practice session saved!');
    } catch (error) {
      console.error('Error saving practice session:', error);
      toast.error('Failed to save practice session');
    }
  };
  
  // Update user's practice streak
  const updatePracticeStreak = async () => {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('last_practice_date, practice_streak')
        .eq('id', user!.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Calculate streak
      const today = new Date().toISOString().split('T')[0];
      let newStreak = 1;
      let streakBroken = true;
      
      if (profile) {
        const lastPracticeDate = profile.last_practice_date;
        const streak = profile.practice_streak || 0;
        
        if (lastPracticeDate) {
          // Check if last practice was yesterday
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastPracticeDate === yesterdayStr) {
            newStreak = streak + 1;
            streakBroken = false;
          } else if (lastPracticeDate === today) {
            // Already practiced today, maintain streak
            newStreak = streak;
            streakBroken = false;
          }
        }
      }
      
      // Update profile with new streak
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          practice_streak: newStreak,
          last_practice_date: today
        })
        .eq('id', user!.id);
      
      if (updateError) throw updateError;
      
      if (streakBroken && newStreak === 1) {
        toast.info('You started a new practice streak!');
      } else if (newStreak > 1) {
        toast.info(`You're on a ${newStreak} day practice streak!`);
      }
    } catch (error) {
      console.error('Error updating practice streak:', error);
    }
  };
  
  // Start a new practice session
  const handleStartNewPractice = () => {
    generateProblems();
  };
  
  // Update total time
  const handleTimeUpdate = (time: number) => {
    setTotalTime(time);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {!practiceComplete ? (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate(-1)}
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
                      onTimeUpdate={handleTimeUpdate}
                      className=""
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentProblemIndex) / problems.length) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <div>Problem {currentProblemIndex + 1} of {problems.length}</div>
                  <div>{correctAnswers} Correct</div>
                </div>
                
                {currentProblem && (
                  <MathProblem 
                    problem={currentProblem}
                    onAnswer={handleAnswer}
                    onNextProblem={handleNextProblem}
                    className="bg-white border border-border/60 rounded-xl shadow-sm"
                  />
                )}
              </div>
            </>
          ) : (
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
                  total={problems.length}
                  avgTime={averageTime}
                />
                
                <div className="flex flex-col gap-4">
                  <Button onClick={handleStartNewPractice} size="lg">
                    Start New Practice
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/profile')}
                  >
                    View Your Profile
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Practice;
