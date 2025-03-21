
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MathProblem from '@/components/MathProblem';
import PracticeHeader from '@/components/PracticeHeader';
import PracticeProgress from '@/components/PracticeProgress';
import PracticeComplete from '@/components/PracticeComplete';
import { usePractice } from '@/hooks/usePractice';

const Practice = () => {
  const navigate = useNavigate();
  const {
    problems,
    currentProblemIndex,
    timerRunning,
    practiceComplete,
    difficulty,
    correctAnswers,
    answerTimes,
    currentProblem,
    averageTime,
    handleAnswer,
    handleNextProblem,
    handleTimeUpdate,
    startNewPractice
  } = usePractice();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {!practiceComplete ? (
            <>
              <PracticeHeader 
                difficulty={difficulty}
                timerRunning={timerRunning}
                onTimeUpdate={handleTimeUpdate}
                onGoBack={() => navigate(-1)}
              />
              
              <div className="flex flex-col gap-4">
                <PracticeProgress 
                  currentProblemIndex={currentProblemIndex}
                  totalProblems={problems.length}
                  correctAnswers={correctAnswers}
                />
                
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
            <PracticeComplete 
              correctAnswers={correctAnswers}
              totalProblems={problems.length}
              averageTime={averageTime}
              onStartNewPractice={startNewPractice}
              onViewProfile={() => navigate('/profile')}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Practice;
