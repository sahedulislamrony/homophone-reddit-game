import { useRouter } from '@client/contexts/RouterContext';
import {
  Home,
  TrendingUp,
  Trophy,
  Coins,
  Target,
  Calendar,
  Award,
  Zap,
  Star,
  Medal,
  Crown,
  Clock,
  BarChart3,
  Percent,
} from 'lucide-react';
import { UserStats, Achievement, StatCard } from '@shared/types/stats';

// Mock user stats data
const userStats: UserStats = {
  streak: 7,
  homophonesSolved: 156,
  totalCoins: 2340,
  todaysRank: 3,
  allTimeRank: 12,
  gamesPlayed: 45,
  bestScore: 180,
  averageScore: 95,
  hintsUsed: 23,
  accuracy: 87.5,
  joinDate: '2024-01-01',
  lastPlayed: '2024-01-15',
  achievements: [
    {
      id: 'first_game',
      name: 'First Steps',
      description: 'Complete your first game',
      icon: '🎯',
      unlocked: true,
      unlockedDate: '2024-01-01',
      progress: 100,
      maxProgress: 1,
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: true,
      unlockedDate: '2024-01-15',
      progress: 100,
      maxProgress: 7,
    },
    {
      id: 'hundred_solved',
      name: 'Century Solver',
      description: 'Solve 100 homophones',
      icon: '💯',
      unlocked: true,
      unlockedDate: '2024-01-10',
      progress: 100,
      maxProgress: 100,
    },
    {
      id: 'perfect_game',
      name: 'Perfectionist',
      description: 'Complete a game without hints',
      icon: '⭐',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'top_ten',
      name: 'Elite Player',
      description: 'Reach top 10 in daily rankings',
      icon: '👑',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
    },
  ],
};

export default function StatsPage() {
  const router = useRouter();

  const statCards: StatCard[] = [
    {
      title: 'Current Streak',
      value: userStats.streak,
      subtitle: 'days',
      icon: '🔥',
      color: 'warning',
      trend: { value: 2, isPositive: true },
    },
    {
      title: 'Homophones Solved',
      value: userStats.homophonesSolved,
      subtitle: 'total',
      icon: '🎯',
      color: 'success',
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Total Coins',
      value: userStats.totalCoins.toLocaleString(),
      subtitle: 'earned',
      icon: '🪙',
      color: 'accent',
      trend: { value: 150, isPositive: true },
    },
    {
      title: "Today's Rank",
      value: `#${userStats.todaysRank}`,
      subtitle: 'out of 1,234 players',
      icon: '🏆',
      color: 'primary',
      trend: { value: 2, isPositive: true },
    },
    {
      title: 'All-Time Rank',
      value: `#${userStats.allTimeRank}`,
      subtitle: 'out of 15,678 players',
      icon: '👑',
      color: 'accent',
      trend: { value: 5, isPositive: true },
    },
    {
      title: 'Accuracy',
      value: `${userStats.accuracy}%`,
      subtitle: 'correct answers',
      icon: '🎯',
      color: 'success',
      trend: { value: 2.5, isPositive: true },
    },
  ];

  const getColorClasses = (color: StatCard['color']) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 border-primary/30 text-primary';
      case 'accent':
        return 'bg-accent/10 border-accent/30 text-accent';
      case 'success':
        return 'bg-success/10 border-success/30 text-success';
      case 'warning':
        return 'bg-warning/10 border-warning/30 text-warning';
      case 'error':
        return 'bg-error/10 border-error/30 text-error';
      default:
        return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  const getAchievementIcon = (achievement: Achievement) => {
    const iconMap: { [key: string]: any } = {
      '🎯': Target,
      '🔥': Zap,
      '💯': BarChart3,
      '⭐': Star,
      '👑': Crown,
    };
    return iconMap[achievement.icon] || Award;
  };

  return (
    <div className="w-full min-h-screen dark-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>

      {/* Close/Home Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => router.goto('home')}
          className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-xl hover:bg-card transition-all duration-300 glow-hover"
        >
          <Home className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-accent" />
              <h1 className="text-4xl font-bold text-accent neon-glow">Your Statistics</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Track your progress and achievements in the Daily Homophone Hunt
            </p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/85 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 hover:bg-gray-900/90 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  {stat.trend && (
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.trend.isPositive ? 'text-success' : 'text-error'
                      }`}
                    >
                      <TrendingUp
                        className={`w-4 h-4 ${stat.trend.isPositive ? 'rotate-0' : 'rotate-180'}`}
                      />
                      <span>+{stat.trend.value}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Stats Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Performance Overview */}
            <div className="bg-gray-900/85 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                Performance Overview
              </h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Games Played</span>
                  <span className="text-foreground font-semibold">{userStats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Best Score</span>
                  <span className="text-accent font-semibold">{userStats.bestScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="text-foreground font-semibold">{userStats.averageScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hints Used</span>
                  <span className="text-warning font-semibold">{userStats.hintsUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-foreground font-semibold">
                    {new Date(userStats.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Played</span>
                  <span className="text-foreground font-semibold">
                    {new Date(userStats.lastPlayed).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-900/85 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-accent" />
                Achievements
              </h2>
              <div className="space-y-4">
                {userStats.achievements.map((achievement) => {
                  const IconComponent = getAchievementIcon(achievement);
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        achievement.unlocked
                          ? 'bg-accent/10 border-accent/30'
                          : 'bg-muted/20 border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            achievement.unlocked ? 'bg-accent/20' : 'bg-muted/40'
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              achievement.unlocked ? 'text-accent' : 'text-muted-foreground'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${
                              achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          {achievement.unlocked ? (
                            <div className="text-xs text-accent">
                              Unlocked on {new Date(achievement.unlockedDate!).toLocaleDateString()}
                            </div>
                          ) : (
                            <div className="w-full bg-muted/30 rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.goto('game')}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 accent-hover font-semibold"
              >
                Play Now
              </button>
              <button
                onClick={() => router.goto('leaderboard')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 glow-hover font-semibold"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
