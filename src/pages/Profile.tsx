
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { User, Clock, BarChart2, Activity } from 'lucide-react';

// Mock data for now - would be replaced with real data from backend
const mockUserData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  joined: '2023-06-15',
  stats: {
    totalProblems: 248,
    correctAnswers: 201,
    accuracy: 81,
    avgTime: 2.3,
    bestTime: 0.9,
    practiceStreak: 5,
    lastPractice: '2023-07-01'
  },
  history: [
    { date: '2023-06-30', problems: 20, correct: 18, accuracy: 90, avgTime: 2.1 },
    { date: '2023-06-29', problems: 15, correct: 12, accuracy: 80, avgTime: 2.2 },
    { date: '2023-06-28', problems: 25, correct: 20, accuracy: 80, avgTime: 2.3 },
    { date: '2023-06-27', problems: 18, correct: 14, accuracy: 78, avgTime: 2.4 },
    { date: '2023-06-26', problems: 22, correct: 19, accuracy: 86, avgTime: 2.2 }
  ]
};

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Your Profile</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress and see your math skills improve over time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-1">
              <div className="bg-white border border-border/60 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{mockUserData.name}</h2>
                  <p className="text-muted-foreground">{mockUserData.email}</p>
                  <div className="text-sm text-muted-foreground mt-2">
                    Member since {new Date(mockUserData.joined).toLocaleDateString()}
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white border border-border/60 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Accuracy</span>
                    </div>
                    <div className="text-2xl font-semibold">{mockUserData.stats.accuracy}%</div>
                    <div className="text-xs text-muted-foreground">
                      {mockUserData.stats.correctAnswers} correct out of {mockUserData.stats.totalProblems}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Average Time</span>
                    </div>
                    <div className="text-2xl font-semibold">{mockUserData.stats.avgTime}s</div>
                    <div className="text-xs text-muted-foreground">
                      Best time: {mockUserData.stats.bestTime}s
                    </div>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart2 className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Practice Streak</span>
                    </div>
                    <div className="text-2xl font-semibold">{mockUserData.stats.practiceStreak} days</div>
                    <div className="text-xs text-muted-foreground">
                      Last practice: {new Date(mockUserData.stats.lastPractice).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border/60 rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">Recent Practice Sessions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Date</th>
                    <th className="text-right pb-2">Problems</th>
                    <th className="text-right pb-2">Correct</th>
                    <th className="text-right pb-2">Accuracy</th>
                    <th className="text-right pb-2">Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUserData.history.map((session, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="text-right py-3">{session.problems}</td>
                      <td className="text-right py-3">{session.correct}</td>
                      <td className="text-right py-3">{session.accuracy}%</td>
                      <td className="text-right py-3">{session.avgTime}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button className="min-w-40">
              Start New Practice
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
