import { useState } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import { useLoading } from '@client/components/Loader';

type TimeFilter = 'all-time' | 'today' | 'week';
type DifficultyFilter = 'beginner' | 'intermediate' | 'advanced';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level: string;
  avatar: string;
  badge: string;
}

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('beginner');
  const router = useRouter();
  const { startLoading } = useLoading();

  // Dummy data
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      username: 'FocusMaster',
      score: 12500,
      level: 'Advanced',
      avatar: '🧠',
      badge: 'gold',
    },
    {
      rank: 2,
      username: 'AttentionPro',
      score: 11200,
      level: 'Advanced',
      avatar: '🎯',
      badge: 'silver',
    },
    {
      rank: 3,
      username: 'MindTrainer',
      score: 9800,
      level: 'Intermediate',
      avatar: '⚡',
      badge: 'bronze',
    },
    {
      rank: 4,
      username: 'ConcentrationKing',
      score: 8450,
      level: 'Intermediate',
      avatar: '👑',
      badge: 'none',
    },
    {
      rank: 5,
      username: 'FocusNewbie',
      score: 7600,
      level: 'Beginner',
      avatar: '🌟',
      badge: 'none',
    },
    {
      rank: 6,
      username: 'AttentionSeeker',
      score: 6800,
      level: 'Intermediate',
      avatar: '🔍',
      badge: 'none',
    },
    {
      rank: 7,
      username: 'MindBender',
      score: 6200,
      level: 'Advanced',
      avatar: '🌀',
      badge: 'none',
    },
    {
      rank: 8,
      username: 'FocusFinder',
      score: 5900,
      level: 'Beginner',
      avatar: '🔎',
      badge: 'none',
    },
    {
      rank: 9,
      username: 'AttentionGuru',
      score: 5400,
      level: 'Intermediate',
      avatar: '🧘',
      badge: 'none',
    },
    {
      rank: 10,
      username: 'MindReader',
      score: 5100,
      level: 'Beginner',
      avatar: '📖',
      badge: 'none',
    },
  ];

  const handleFilterChange = async () => {
    await startLoading(500);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Modern Header */}
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.goto('home')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Leaderboard
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Time Period</label>
              <select
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={timeFilter}
                onChange={(e) => {
                  setTimeFilter(e.target.value as TimeFilter);
                  void handleFilterChange();
                }}
              >
                <option value="all-time">All Time</option>
                <option value="week">This Week</option>
                <option value="today">Today</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
              <select
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={difficultyFilter}
                onChange={(e) => {
                  setDifficultyFilter(e.target.value as DifficultyFilter);
                  void handleFilterChange();
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-2xl font-semibold text-foreground mb-1">1,247</div>
              <div className="text-sm text-muted-foreground">Total Players</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-2xl font-semibold text-foreground mb-1">12,500</div>
              <div className="text-sm text-muted-foreground">Highest Score</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-2xl font-semibold text-foreground mb-1">847</div>
              <div className="text-sm text-muted-foreground">Active Today</div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Top Performers</h2>
              <p className="text-sm text-muted-foreground">
                Ranked by highest attention training scores
              </p>
            </div>

            <div className="divide-y divide-border">
              {leaderboardData.map((player, index) => (
                <LeaderboardRow key={player.rank} player={player} index={index} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LeaderboardRow({ player, index }: { player: LeaderboardEntry; index: number }) {
  const isTopThree = index < 3;

  const badgeIcons = {
    gold: <Medal className="w-4 h-4 text-yellow-500" />,
    silver: <Medal className="w-4 h-4 text-gray-400" />,
    bronze: <Medal className="w-4 h-4 text-amber-600" />,
    none: null,
  };

  return (
    <div
      className={`flex items-center p-6 hover:bg-muted/50 transition-colors ${
        isTopThree ? 'bg-primary/5' : ''
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${
            index === 0
              ? 'bg-yellow-100 text-yellow-600'
              : index === 1
                ? 'bg-gray-100 text-gray-600'
                : index === 2
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-muted text-muted-foreground'
          }`}
        >
          {player.rank}
        </div>

        <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-full text-xl">
          {player.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{player.username}</h3>
            {badgeIcons[player.badge as keyof typeof badgeIcons]}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{player.level}</span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span className="text-sm text-muted-foreground">Level {player.level}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold text-foreground">
            {player.score.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">points</div>
        </div>
      </div>
    </div>
  );
}
