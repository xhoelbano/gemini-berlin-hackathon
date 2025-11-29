import React from 'react';
import { UserStats } from '../types';
import { Trophy, Star, Medal, Zap, Crown, Flame, ArrowUp } from 'lucide-react';

interface LeaderboardProps {
  stats: UserStats;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ stats }) => {
  return (
    <div className="p-4 md:p-8 bg-slate-900 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
             <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2 uppercase tracking-widest flex items-center justify-center gap-2">
                <Crown className="w-8 h-8 text-yellow-500" />
                Architect's League
             </h2>
             <p className="text-slate-400 text-sm">Compete to shape the future of Berlin</p>
          </header>

          {/* User Stats Card - Gamified */}
          <div className="bg-gradient-to-br from-indigo-900/80 to-slate-800/80 backdrop-blur rounded-3xl p-1 shadow-[0_0_40px_rgba(99,102,241,0.2)] mb-10 border border-indigo-500/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-slate-900/90 rounded-[22px] p-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    
                    {/* Rank Circle */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-indigo-900/50 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                            <div className="text-center">
                                <div className="text-[10px] text-indigo-300 uppercase font-bold">Rank</div>
                                <div className="text-3xl font-black text-white italic">#{stats.rank === 'City Architect' ? '1' : '42'}</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full flex items-center border-2 border-slate-900">
                            <ArrowUp className="w-3 h-3 mr-1" /> Top 5%
                        </div>
                    </div>

                    {/* Stats & XP */}
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-2xl font-bold text-white">{stats.rank}</h3>
                            <div className="text-indigo-400 font-mono font-bold">{stats.points} / 500 XP</div>
                        </div>
                        {/* XP Bar */}
                        <div className="h-4 bg-slate-700 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-[70%] animate-pulse relative">
                                <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4">
                            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-bold text-white">12 Day Streak</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-bold text-white">{stats.votesReceived} Likes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-3">
              {[
                  { name: 'Marcus_Designs', points: 950, avatar: 12, streak: 45 },
                  { name: 'Sarah_Builds', points: 880, avatar: 34, streak: 12 },
                  { name: 'Berlin_Creator', points: 820, avatar: 5, streak: 8 },
                  { name: 'Eco_Architect', points: 750, avatar: 8, streak: 20 },
                  { name: 'Urban_Planner_X', points: 600, avatar: 22, streak: 3 },
              ].map((user, i) => (
                  <div key={i} className={`flex items-center p-4 rounded-xl border transition-all hover:scale-[1.02] ${i === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-slate-800 border-yellow-500/30' : 'bg-slate-800 border-slate-700'}`}>
                      <div className={`font-black w-8 text-center text-xl ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-700' : 'text-slate-500'}`}>
                          {i + 1}
                      </div>
                      
                      <div className="relative mx-4">
                        <div className="w-12 h-12 rounded-full bg-slate-600 overflow-hidden border-2 border-slate-500">
                            <img src={`https://picsum.photos/100?random=${user.avatar}`} alt="User" />
                        </div>
                        {i < 3 && <div className="absolute -top-2 -right-2"><Crown className={`w-5 h-5 ${i === 0 ? 'text-yellow-500' : 'text-slate-400'} fill-current`} /></div>}
                      </div>

                      <div className="flex-1">
                          <div className="text-white font-bold flex items-center">
                              {user.name}
                              {user.streak > 10 && <Flame className="w-3 h-3 text-orange-500 ml-2" />}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">Level {Math.floor(user.points / 100)} Architect</div>
                      </div>

                      <div className="text-right">
                          <div className="text-indigo-400 font-bold">{user.points} XP</div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Leaderboard;