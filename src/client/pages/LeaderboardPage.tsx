import { useState } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { Home, Trophy, Medal, Award, Crown, BarChart3 } from 'lucide-react';
import { LeaderboardEntry } from '@shared/types/game';

// Dummy data for leaderboard
const todayData: LeaderboardEntry[] = [
  { rank: 1, username: 'wizard123', points: 150, date: '2024-01-15' },
  { rank: 2, username: 'homophoneHero', points: 120, date: '2024-01-15' },
  { rank: 3, username: 'grammarGoblin', points: 110, date: '2024-01-15' },
  { rank: 4, username: 'wordMaster', points: 95, date: '2024-01-15' },
  { rank: 5, username: 'spellChecker', points: 85, date: '2024-01-15' },
  { rank: 6, username: 'lexiconLover', points: 80, date: '2024-01-15' },
  { rank: 7, username: 'syntaxSavant', points: 75, date: '2024-01-15' },
  { rank: 8, username: 'vocabVirtuoso', points: 70, date: '2024-01-15' },
];

const allTimeData: LeaderboardEntry[] = [
  { rank: 1, username: 'wizard123', points: 2500 },
  { rank: 2, username: 'homophoneHero', points: 2300 },
  { rank: 3, username: 'grammarGoblin', points: 2100 },
  { rank: 4, username: 'wordMaster', points: 1950 },
  { rank: 5, username: 'spellChecker', points: 1800 },
  { rank: 6, username: 'lexiconLover', points: 1650 },
  { rank: 7, username: 'syntaxSavant', points: 1500 },
  { rank: 8, username: 'vocabVirtuoso', points: 1350 },
  { rank: 9, username: 'languageLegend', points: 1200 },
  { rank: 10, username: 'textTitan', points: 1050 },
];

export default function LeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'today' | 'allTime'>('today');

  const currentData = activeTab === 'today' ? todayData : allTimeData;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-accent" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-accent/10 border-accent/30 text-accent';
      case 2:
        return 'bg-gray-400/10 border-gray-400/30 text-gray-400';
      case 3:
        return 'bg-amber-600/10 border-amber-600/30 text-amber-600';
      default:
        return 'bg-card/60 border-border text-foreground';
    }
  };

  return (
    <div className="w-full min-h-screen dark-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-6 right-6 z-10 flex gap-3">
        <button
          onClick={() => router.goto('stats')}
          className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-xl hover:bg-card transition-all duration-300 glow-hover"
        >
          <BarChart3 className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => router.goto('home')}
          className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-xl hover:bg-card transition-all duration-300 glow-hover"
        >
          <Home className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-accent" />
              <h1 className="text-4xl font-bold text-accent neon-glow">Leaderboard</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              See how you stack up against other players
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-card/40 backdrop-blur-sm border border-border rounded-xl p-1">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'today'
                    ? 'bg-accent text-accent-foreground accent-glow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab('allTime')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'allTime'
                    ? 'bg-accent text-accent-foreground accent-glow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card/60 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Points
                    </th>
                    {activeTab === 'today' && (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                        Date
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentData.map((entry) => (
                    <tr
                      key={entry.rank}
                      className={`hover:bg-card/40 transition-colors duration-200 ${
                        entry.rank <= 3 ? 'bg-gradient-to-r from-transparent to-accent/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">{getRankIcon(entry.rank)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">
                              {entry.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{entry.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-accent text-lg">
                          {entry.points.toLocaleString()}
                        </span>
                      </td>
                      {activeTab === 'today' && entry.date && (
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Your Score Section */}
          <div className="mt-8 bg-card/40 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">Your Performance</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">0</div>
                  <div className="text-sm text-muted-foreground">Current Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">0</div>
                  <div className="text-sm text-muted-foreground">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-1">0</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
