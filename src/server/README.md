# Server Implementation

This document describes the server-side implementation for the Reddit Game with Redis data storage and REST API synchronization.

## Architecture

### Data Storage (Redis)

- **User Data**: Stored with key pattern `user:{username}`
- **Game Results**: Stored with key pattern `game:{gameId}`
- **Leaderboards**: Stored as sorted sets for efficient ranking
- **User Stats**: Cached for performance
- **Transactions**: Logged for audit trail

### Services

1. **RedisService**: Core Redis operations
2. **UserService**: User management and gem/points operations
3. **GameService**: Game result management and statistics
4. **LeaderboardService**: Ranking and leaderboard operations

### API Routes

- `/api/users/*` - User management
- `/api/games/*` - Game operations
- `/api/leaderboard/*` - Leaderboard data

## Key Features

### User Management

- **User Creation**: Automatic user creation with default values
- **Role System**: Player/Admin roles with admin configuration
- **Gem Management**: Secure gem transactions with audit trail
- **Points System**: Daily and all-time point tracking

### Game Data

- **Game Results**: Complete game result storage with metadata
- **Challenge Tracking**: Prevents duplicate challenge completion
- **Performance Analytics**: Detailed user performance metrics
- **Theme-based Rewards**: Gems awarded based on theme difficulty and completion

### Leaderboards

- **Daily Leaderboard**: Points earned per day
- **Weekly/Monthly**: Aggregated performance over time periods
- **All-time**: Lifetime performance ranking
- **Category Rankings**: Top performers by different metrics

### Data Synchronization

- **Client-Server Sync**: Real-time data synchronization
- **Offline Fallback**: Graceful degradation when server unavailable
- **Auto-sync**: Periodic background synchronization
- **Transaction Logging**: Complete audit trail of all operations

## Security Features

### Gem Security

- **Server-side Validation**: All gem operations validated server-side
- **Transaction Logging**: Complete audit trail of gem transactions
- **Admin Controls**: Admin users can manage gems
- **Duplicate Prevention**: Prevents duplicate game submissions

### Data Integrity

- **Atomic Operations**: Redis operations are atomic
- **Consistent State**: Server maintains authoritative state
- **Validation**: All inputs validated before processing
- **Error Handling**: Comprehensive error handling and logging

## API Endpoints

### User Endpoints

```
POST /api/users/sync - Sync user data
GET /api/users/:username - Get user data
GET /api/users/:username/stats - Get user statistics
GET /api/users/:username/transactions - Get user transactions
POST /api/users/:username/gems - Add gems (admin)
GET /api/users/:username/rank - Get user rankings
GET /api/users/:username/performance - Get performance data
```

### Game Endpoints

```
POST /api/games/submit - Submit game result
GET /api/games/:gameId - Get game result
GET /api/games/can-play/:username/:challengeId - Check if can play
GET /api/games/history/:username - Get user game history
GET /api/games/today/:username - Get today's games
GET /api/games/stats/:username - Get game statistics
GET /api/games/performance/:username - Get performance data
```

### Leaderboard Endpoints

```
GET /api/leaderboard/daily - Daily leaderboard
GET /api/leaderboard/weekly - Weekly leaderboard
GET /api/leaderboard/monthly - Monthly leaderboard
GET /api/leaderboard/all-time - All-time leaderboard
GET /api/leaderboard/top/:category - Top performers by category
GET /api/leaderboard/stats - Leaderboard statistics
GET /api/leaderboard/position/:username - User position
GET /api/leaderboard/rank/:username - User rank
```

## Configuration

### Environment Variables

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

### Admin Configuration

Admins are configured in `src/server/config/admins.ts`:

```typescript
export const ADMIN_USERS = [
  'rony0110', // Primary admin
] as const;
```

## Data Models

### UserData

```typescript
{
  username: string;
  role: 'player' | 'admin';
  gems: number;
  totalPoints: number;
  dailyPoints: number;
  currentStreak: number;
  lastPlayedDate: string;
  createdAt: string;
  isActive: boolean;
}
```

### GameResult

```typescript
{
  id: string;
  username: string;
  challengeId: string;
  date: string;
  score: number;
  hintsUsed: number;
  freeHintsUsed: number;
  gemsSpent: number;
  gemsEarned: number;
  completedAt: string;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
  themeName: string;
}
```

## Client Integration

The client uses `DataSyncService` for server communication:

- **Initial Load**: Loads user data and gems on game start
- **Game Submission**: Submits results and syncs data
- **Real-time Updates**: Updates UI with server data
- **Offline Support**: Graceful fallback when server unavailable

## Performance Considerations

- **Redis Caching**: Frequently accessed data cached in Redis
- **Lazy Loading**: Data loaded on demand
- **Batch Operations**: Multiple operations batched when possible
- **Connection Pooling**: Redis connection pooling for efficiency
- **Background Sync**: Non-blocking background synchronization

## Monitoring and Logging

- **Transaction Logging**: All gem and point transactions logged
- **Error Logging**: Comprehensive error logging
- **Performance Metrics**: Game statistics and performance tracking
- **Audit Trail**: Complete audit trail for admin operations
