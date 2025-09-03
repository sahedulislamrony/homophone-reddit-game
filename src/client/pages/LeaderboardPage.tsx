import { useState } from 'react';
import { useRouter } from '@client/contexts/RouterContext';

type TimeFilter = 'all-time' | 'today';
type DifficultyFilter = 'easy' | 'medium' | 'hard';

interface LeaderboardEntry {
  rank: number;
  username: string;
  coins: number;
  avatar: string;
}

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('easy');
  const router = useRouter();

  // Dummy data
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, username: 'MinecraftPro', coins: 12500, avatar: '👑' },
    { rank: 2, username: 'BlockBreaker', coins: 11200, avatar: '💎' },
    { rank: 3, username: 'CreeperHunter', coins: 9800, avatar: '⚔️' },
    { rank: 4, username: 'RedditGamer', coins: 8450, avatar: '🎮' },
    { rank: 5, username: 'DiamondFinder', coins: 7600, avatar: '💍' },
    { rank: 6, username: 'NetherExplorer', coins: 6800, avatar: '🔥' },
    { rank: 7, username: 'EnderPlayer', coins: 6200, avatar: '👁️' },
    { rank: 8, username: 'CraftMaster', coins: 5900, avatar: '🧰' },
    { rank: 9, username: 'PvPChampion', coins: 5400, avatar: '🛡️' },
    { rank: 10, username: 'BuilderExpert', coins: 5100, avatar: '🏗️' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">LEADERBOARD</h1>

        {/* Filters */}
        <div className="flex justify-center space-x-4 mb-6">
          <div className="bg-gray-800 p-2 rounded-lg border-2 border-gray-900">
            <span className="mr-2">Time:</span>
            <select
              className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            >
              <option value="all-time">All Time</option>
              <option value="today">Today</option>
            </select>
          </div>

          <div className="bg-gray-800 p-2 rounded-lg border-2 border-gray-900">
            <span className="mr-2">Difficulty:</span>
            <select
              className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-2xl mx-auto bg-gray-800 border-4 border-gray-900 rounded-lg p-6 shadow-2xl">
        {leaderboardData.map((player, index) => (
          <div
            key={player.rank}
            className={`flex items-center py-3 px-4 mb-2 rounded-lg border-2 border-gray-700 ${
              index < 3 ? 'bg-gradient-to-r from-yellow-800 to-yellow-600' : 'bg-gray-700'
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index === 0
                  ? 'bg-yellow-500'
                  : index === 1
                    ? 'bg-gray-400'
                    : index === 2
                      ? 'bg-amber-700'
                      : 'bg-gray-600'
              } font-bold`}
            >
              {player.rank}
            </div>

            <div className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full mx-4 text-2xl">
              {player.avatar}
            </div>

            <div className="flex-grow">
              <div className="font-bold">{player.username}</div>
            </div>

            <div className="flex items-center">
              <span className="text-yellow-400 font-bold mr-1">
                {player.coins.toLocaleString()}
              </span>
              <span className="text-yellow-500">🪙</span>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => router.goto('home')}
          className="px-8 py-3 bg-gradient-to-b from-gray-600 to-gray-800 border-4 border-gray-900 rounded-lg text-xl font-bold hover:from-gray-700 hover:to-gray-900 transition-all"
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}
