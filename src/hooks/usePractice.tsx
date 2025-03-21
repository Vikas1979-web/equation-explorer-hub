
import { useState, useEffect, useCallback } from 'react';
import { Difficulty, generateProblem } from '@/utils/mathUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type PracticeState = {
  problems: any[];
  currentProblemIndex: number;
  timerRunning: boolean;
  practiceComplete: boolean;
  totalTime: number;
  difficulty: Difficulty;
  problemCount: number;
  correctAnswers: number;
  answerTimes: number[];
};

export const usePractice = () => {
  const { user } = useAuth();
  
  // Practice state
  const [problems, setProblems] = useState<any[]>([]);
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
      .map(() => generateProblem(difficulty, 'addition')); // Using 'addition' as default
    
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

  // Handle saving a practice result
  const savePracticeResult = async (correct: boolean, time: number) => {
    if (!user || !currentProblem) return;
    
    try {
      await supabase.from('practice_results').insert({
        user_id: user.id,
        problem: currentProblem.problem,
        answer: currentProblem.answer,
        user_answer: correct ? currentProblem.answer : null,
        is_correct: correct,
        time_taken: time,
        difficulty: difficulty
      });
    } catch (error) {
      console.error('Error saving practice result:', error);
    }
  };
  
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
      await savePracticeResult(correct, time);
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
    if (!user) return;
    
    try {
      const { error } = await supabase.from('practice_sessions').insert({
        user_id: user.id,
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
    if (!user) return;
    
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Calculate streak
      const today = new Date().toISOString().split('T')[0];
      let newStreak = 1;
      let streakBroken = true;
      
      if (profile) {
        // Safely check if these properties exist
        const lastPracticeDate = profile.last_practice_date || null;
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
          last_practice_date: today,
          practice_streak: newStreak
        })
        .eq('id', user.id);
      
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
  const startNewPractice = () => {
    generateProblems();
  };
  
  // Update total time
  const handleTimeUpdate = (time: number) => {
    setTotalTime(time);
  };

  return {
    problems,
    currentProblemIndex,
    timerRunning,
    practiceComplete,
    totalTime,
    difficulty,
    problemCount,
    correctAnswers,
    answerTimes,
    currentProblem,
    averageTime,
    handleAnswer,
    handleNextProblem,
    handleTimeUpdate,
    startNewPractice
  };
};
