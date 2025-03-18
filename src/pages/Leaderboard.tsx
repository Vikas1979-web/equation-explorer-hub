
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Difficulty } from '@/utils/mathUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrophyIcon, Medal } from 'lucide-react';

// Mock data for now - would be replaced with real data from backend
const mockLeaderboardData = {
  easy: [
    { id: 1, name: 'Alice Cooper', score: 95, avgTime: 1.2 },
    { id: 2, name: 'Bob Smith', score: 92, avgTime: 1.5 },
    { id: 3, name: 'Charlie Brown', score: 88, avgTime: 1.7 },
    { id: 4, name: 'David Jones', score: 85, avgTime: 1.8 },
    { id: 5, name: 'Emma Wilson', score: 82, avgTime: 2.0 },
    { id: 6, name: 'Frank Miller', score: 80, avgTime: 2.1 },
    { id: 7, name: 'Grace Lee', score: 78, avgTime: 2.2 },
    { id: 8, name: 'Henry Ford', score: 75, avgTime: 2.3 },
    { id: 9, name: 'Ivy Chen', score: 72, avgTime: 2.5 },
    { id: 10, name: 'Jack Robinson', score: 70, avgTime: 2.7 }
  ],
  medium: [
    { id: 1, name: 'Megan Taylor', score: 88, avgTime: 2.3 },
    { id: 2, name: 'Nathan Harris', score: 85, avgTime: 2.5 },
    { id: 3, name: 'Olivia Martinez', score: 82, avgTime: 2.7 },
    { id: 4, name: 'Peter Johnson', score: 79, avgTime: 2.9 },
    { id: 5, name: 'Quinn Williams', score: 76, avgTime: 3.1 },
    { id: 6, name: 'Rachel Davis', score: 73, avgTime: 3.3 },
    { id: 7, name: 'Samuel White', score: 70, avgTime: 3.5 },
    { id: 8, name: 'Tina Brown', score: 67, avgTime: 3.7 },
    { id: 9, name: 'Ulysses Garcia', score: 64, avgTime: 3.9 },
    { id: 10, name: 'Victoria Lopez', score: 61, avgTime: 4.1 }
  ],
  hard: [
    { id: 1, name: 'Walter Green', score: 75, avgTime: 4.5 },
    { id: 2, name: 'Xavier Reed', score: 72, avgTime: 4.7 },
    { id: 3, name: 'Yvonne King', score: 69, avgTime: 4.9 },
    { id: 4, name: 'Zachary Lewis', score: 66, avgTime: 5.1 },
    { id: 5, name: 'Amy Wilson', score: 63, avgTime: 5.3 },
    { id: 6, name: 'Brandon Moore', score: 60, avgTime: 5.5 },
    { id: 7, name: 'Cathy Evans', score: 57, avgTime: 5.7 },
    { id: 8, name: 'Derek Parker', score: 54, avgTime: 5.9 },
    { id: 9, name: 'Eliza Scott', score: 51, avgTime: 6.1 },
    { id: 10, name: 'Felix Turner', score: 48, avgTime: 6.3 }
  ]
};

const Leaderboard = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600 mb-4">
              <TrophyIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Leaderboard</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how you rank among the top performers in each difficulty level.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Top Performers</h2>
              <div className="w-full max-w-xs">
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-white border border-border/60 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Avg Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaderboardData[difficulty].map((player, index) => (
                    <TableRow key={player.id} className={index < 3 ? "bg-amber-50/50" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {index === 0 ? (
                            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center mr-1">
                              <Medal className="w-3 h-3" />
                            </div>
                          ) : index === 1 ? (
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mr-1">
                              <Medal className="w-3 h-3" />
                            </div>
                          ) : index === 2 ? (
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-1">
                              <Medal className="w-3 h-3" />
                            </div>
                          ) : (
                            <span className="w-6 h-6 inline-flex items-center justify-center">{index + 1}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell className="text-right">{player.score}%</TableCell>
                      <TableCell className="text-right">{player.avgTime.toFixed(1)}s</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
