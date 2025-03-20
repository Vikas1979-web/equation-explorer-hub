
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { User, Clock, BarChart2, Activity, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    correctAnswers: 0,
    accuracy: 0,
    avgTime: 0,
    bestTime: 0,
    practiceStreak: 0,
    lastPractice: null
  });

  useEffect(() => {
    // If not loading and no user, redirect to auth page
    if (!loading && !user) {
      toast.info('Please sign in to view your profile');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }
        
        // Try to fetch practice sessions if the table exists
        let practiceSessionsData = [];
        let practiceStats = { ...stats };
        
        try {
          // Fetch practice sessions
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('practice_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (!sessionsError && sessionsData) {
            practiceSessionsData = sessionsData;
            
            // Calculate stats from sessions
            if (sessionsData.length > 0) {
              const totalProblems = sessionsData.reduce((sum, session) => sum + session.total_problems, 0);
              const correctAnswers = sessionsData.reduce((sum, session) => sum + session.correct_answers, 0);
              const totalTime = sessionsData.reduce((sum, session) => sum + session.total_time, 0);
              
              practiceStats = {
                totalProblems,
                correctAnswers,
                accuracy: totalProblems > 0 ? Math.round((correctAnswers / totalProblems) * 100) : 0,
                avgTime: totalProblems > 0 ? totalTime / totalProblems : 0,
                bestTime: Math.min(...sessionsData.map(s => s.average_time || Infinity)),
                practiceStreak: profileData.practice_streak || 0,
                lastPractice: profileData.last_practice_date
              };
              
              // Fix infinity if no valid times
              if (practiceStats.bestTime === Infinity) {
                practiceStats.bestTime = 0;
              }
            }
          }
        } catch (error) {
          console.warn('Error fetching practice data:', error);
          // This is expected if tables don't exist yet, so we'll just use default values
        }
        
        // Set stats
        setStats(practiceStats);
        setPracticeHistory(practiceSessionsData);

        // Setup user data with profile information
        const userDataWithStats = {
          ...profileData,
          name: profileData.username || user.email?.split('@')[0] || 'User',
          email: user.email || 'No email',
          joined: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };
        
        setUserData(userDataWithStats);
      } catch (error) {
        toast.error('Failed to load profile data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, stats]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!user || !userData) {
    return null;
  }

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
                  <Avatar className="w-20 h-20 mb-4">
                    <AvatarImage src={userData.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {userData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.email}</p>
                  <div className="text-sm text-muted-foreground mt-2">
                    Member since {new Date(userData.joined).toLocaleDateString()}
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
                    <div className="text-2xl font-semibold">{stats.accuracy}%</div>
                    <div className="text-xs text-muted-foreground">
                      {stats.correctAnswers} correct out of {stats.totalProblems}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Average Time</span>
                    </div>
                    <div className="text-2xl font-semibold">
                      {stats.avgTime > 0 ? `${stats.avgTime.toFixed(1)}s` : '-'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Best time: {stats.bestTime > 0 ? `${stats.bestTime.toFixed(1)}s` : '-'}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart2 className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Practice Streak</span>
                    </div>
                    <div className="text-2xl font-semibold">{stats.practiceStreak || 0} days</div>
                    <div className="text-xs text-muted-foreground">
                      {stats.lastPractice 
                        ? `Last practice: ${new Date(stats.lastPractice).toLocaleDateString()}`
                        : 'No practice sessions yet'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border/60 rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">Recent Practice Sessions</h3>
            
            {practiceHistory && practiceHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Difficulty</th>
                      <th className="pb-2 font-medium text-right">Score</th>
                      <th className="pb-2 font-medium text-right">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {practiceHistory.map((session: any, index: number) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">{new Date(session.created_at).toLocaleDateString()}</td>
                        <td className="py-3 capitalize">{session.difficulty}</td>
                        <td className="py-3 text-right">
                          {session.correct_answers}/{session.total_problems}
                          <span className="text-muted-foreground ml-1 text-sm">
                            ({Math.round((session.correct_answers / session.total_problems) * 100)}%)
                          </span>
                        </td>
                        <td className="py-3 text-right">{session.average_time.toFixed(1)}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground py-6 text-center">
                You haven't completed any practice sessions yet.
              </p>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button className="min-w-40" onClick={() => navigate('/practice')}>
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
