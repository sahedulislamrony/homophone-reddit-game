# 🎯 The Daily Homophone

A Reddit-based word game where players hunt down impostor words and replace them with correct homophones. Built with Devvit, React, and TypeScript.

## 🎮 Game Overview

**The Daily Homophone** is an engaging word puzzle game that challenges players to identify and correct homophone errors in themed text passages. Players earn points, build streaks, and compete on leaderboards while improving their language skills.

### Key Features

- **Daily Challenges**: Fresh content every day with themed challenges
- **Progressive Difficulty**: Easy (5 gems), Medium (10 gems), Hard (20 gems) [Can varies]
- **Streak System**: Build consecutive correct answers for bonus points
- **Hint System**: 3 free hints per challenge + gem-purchased additional hints
- **Leaderboards**: Daily, and all-time rankings (weekly and monthly will come latter)
- **Statistics Tracking**: Comprehensive performance analytics
- **Gem Economy**: Earn gems for completions and can use for using extra hints. Plans to expend it on custom game profile section , boosted post and many more.
- **Real-time Sync**: Server-based data synchronization
- **User Generated Content (UGC)**: Players can comment on their game results and share experiences on game posts

## 🎯 How to Play

### Objective

Find incorrect words in themed text passages and replace them with the correct homophones. Homophones are words that sound the same but have different meanings and spellings.

### Gameplay Flow

#### **1. Challenge Selection**

- Navigate to Daily Challenges page
- View available themes for today
- Select difficulty level (Easy/Medium/Hard)
- Check completion status and gem rewards

#### **2. Game Initialization**

- Game loads with themed background
- Content displays with homophone errors
- User gems and stats sync from server
- Game engine initializes with challenge data

#### **3. Core Gameplay Loop**

```
Read Content → Identify Error → Type Correction → Submit Answer → Receive Feedback → Next Word
```

#### **4. Answer Submission Process**

- **Input Validation**: Check for empty or duplicate submissions
- **Answer Verification**: Compare against correct words list
- **Scoring Calculation**: Apply streak multipliers and penalties
- **State Update**: Update progress, score, and hints used
- **Feedback Display**: Show result with points earned

#### **5. Game Completion**

- All words found successfully
- Final score calculated with bonuses
- Gems awarded based on theme difficulty
- Result submitted to server
- Redirect to results page

### Example Gameplay

```
Given: "The gardener had to sow the seeds in rows, using a hoe to break up the soil and waiting for the son to help the plants grow."

Errors Found:
- "sow" → "sew" (to stitch, not plant seeds)
- "rows" → "rose" (flower, not lines)
- "hoe" → "whole" (entire, not tool)
- "son" → "sun" (star, not male child)

Scoring:
- Word 1: 10 points (base)
- Word 2: 15 points (streak bonus)
- Word 3: 20 points (streak bonus)
- Word 4: 25 points (streak bonus)
- Total: 70 points + 5 gems
```

### Advanced Game Mechanics

#### **Progressive Streak System**

```typescript
// Streak multiplier calculation
const streakBonus = basePoints * 0.5 * (streak - 1);
const totalPoints = basePoints + streakBonus;

// Examples:
// Streak 1: 10 points (no bonus)
// Streak 2: 15 points (10 + 5 bonus)
// Streak 3: 20 points (10 + 10 bonus)
// Streak 4: 25 points (10 + 15 bonus)
```

#### **Hint System Mechanics**

- **Free Hints**: First 3 hints cost nothing
- **Gem Hints**: Additional hints cost 1 gem each
- **Hint Penalty**: -2 points per gem hint used
- **Streak Reset**: Any hint usage resets streak to 0
- **Hint Quality**: Contextual clues that guide without revealing answers

#### **Difficulty Scaling**

| Difficulty | Words | Base Points | Gems Earned | Hint Count |
| ---------- | ----- | ----------- | ----------- | ---------- |
| Easy       | 3-4   | 10          | 5           | 4-5        |
| Medium     | 4-5   | 15          | 10          | 5-6        |
| Hard       | 5-6   | 20          | 15          | 6-8        |

#### **Real-time State Management**

```typescript
// Game state updates in real-time
interface GameState {
  currentWordIndex: number; // Progress tracking
  userAnswers: string[]; // Found words
  score: number; // Running total
  hintsUsed: number; // Hint consumption
  gems: number; // Available currency
  freeHintsUsed: number; // Free hint tracking
  isCompleted: boolean; // Completion status
}
```

### User Experience Flow

#### **Daily Challenge Page**

1. **Authentication**: Verify user login status
2. **Date Sync**: Get server date for today's challenges
3. **Data Loading**: Fetch static content + user progress
4. **Status Update**: Mark completed challenges
5. **UI Rendering**: Display available challenges

#### **Game Page**

1. **Challenge Loading**: Load specific theme data
2. **User Data Sync**: Get gems and stats from server
3. **Game Initialization**: Create game engine instance
4. **Interactive Play**: Handle user input and feedback
5. **Completion Handling**: Submit results and redirect

#### **Result Page**

1. **Score Display**: Show final score and gems earned
2. **Statistics**: Display performance metrics
3. **Leaderboard**: Show ranking information
4. **Navigation**: Options to play more or view stats

### Error Handling & Validation

#### **Input Validation**

- **Empty Submissions**: Prevented with UI feedback
- **Duplicate Answers**: Checked against previous submissions
- **Case Insensitive**: Matching handles different cases
- **Whitespace Handling**: Automatic trimming of input

#### **Game State Validation**

- **Challenge Availability**: Verify user can play challenge
- **Completion Status**: Prevent replaying completed challenges
- **Gem Sufficiency**: Check gem availability for hints
- **Server Sync**: Handle network errors gracefully

## 💬 User Generated Content (UGC)

### Community Interaction

**The Daily Homophone** encourages community engagement through user-generated content features that allow players to share their gaming experiences and connect with fellow word enthusiasts.

### Comment System

- **Game Result Comments**: Players can comment on their game results directly on game posts
- **Experience Sharing**: Share strategies, tips, and funny moments from gameplay
- **Community Discussion**: Engage in conversations about homophones and language learning
- **Social Features**: Connect with other players and build a community around word games

### UGC Benefits

- **Learning Enhancement**: Learn from other players' approaches and mistakes
- **Community Building**: Create lasting connections with fellow word game enthusiasts
- **Content Discovery**: Discover new strategies and insights through community discussions
- **Engagement Boost**: Increased player retention through social interaction features

## 🚀 Getting Started

### Prerequisites

- **Node.js 22+**: Download from [nodejs.org](https://nodejs.org/)
- **Reddit Account**: Required for Devvit platform access [reddit.com](https://www.reddit.com/)
- **Devvit CLI**: Installed via npm [developers.reddit.com](https://developers.reddit.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sahedulislamrony/homophone-reddit-game
   cd dailyhomophone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Login to Devvit**

   ```bash
   npm run login
   ```

   Follow the prompts to authenticate with Reddit.

4. **Build the project**
   ```bash
   npm run build
   ```

## 🛠️ Development

### Development Commands

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start development server with live reload |
| `npm run dev:client` | Build client with watch mode              |
| `npm run dev:server` | Build server with watch mode              |
| `npm run dev:devvit` | Start Devvit playtest                     |
| `npm run dev:vite`   | Start Vite dev server on port 7474        |

### Development Workflow

1. **Start Development**

   ```bash
   npm run dev
   ```

   This runs all development servers concurrently:

   - Client build watcher
   - Server build watcher
   - Devvit playtest server

2. **Test on Reddit**

   - The app will be available in your test subreddit
   - Default test subreddit: `dailyhomophone_dev`
   - Configure in `devvit.json` under `dev.subreddit`

3. **Make Changes**
   - Edit files in `src/client/` for UI changes
   - Edit files in `src/server/` for backend logic
   - Changes auto-rebuild and sync to Reddit

### Project Structure

```
src/
├── client/                           # Frontend React app
│   ├── components/                   # Reusable UI components
│   │   ├── basic/                   # Basic UI components (Navigation, etc.)
│   │   ├── IntroText.tsx            # Introduction text component
│   │   ├── LaunchButton.tsx         # Game launch button
│   │   ├── Logo.tsx                 # App logo component
│   │   ├── Notice.tsx               # Notice/alert component
│   │   └── UnifiedLoader.tsx        # Loading component
│   ├── contexts/                    # React context providers
│   │   ├── RouterContext.tsx       # Client-side routing
│   │   └── UserContext.tsx          # User authentication & data
│   ├── game/                        # Game-specific components & logic
│   │   ├── components/              # Game UI components
│   │   │   ├── ChallengeCard.tsx   # Challenge selection card
│   │   │   ├── GameCard.tsx         # Main game interface
│   │   │   ├── GameResult.tsx       # Game completion display
│   │   │   └── LeaderboardCard.tsx # Leaderboard display
│   │   ├── data/                    # Game content management
│   │   │   ├── assets/              # Weekly challenge data
│   │   │   │   ├── week1.ts         # Week 1 challenges
│   │   │   │   ├── week2.ts         # Week 2 challenges
│   │   │   │   ├── week3.ts         # Week 3 challenges
│   │   │   │   ├── week4.ts         # Week 4 challenges
│   │   │   │   └── index.ts         # Export all week data
│   │   │   ├── dailyChallengesData.ts # Main data aggregator
│   │   │   └── gameData.ts          # Data access utilities
│   │   ├── engine/                  # Game logic engine
│   │   │   └── GameEngine.ts        # Core game mechanics
│   │   └── GamePage.tsx             # Main game page component
│   ├── pages/                       # Main app pages
│   │   ├── DailyChallengePage.tsx   # Daily challenges selection
│   │   ├── GamePage.tsx             # Game play page
│   │   ├── GameResultPage.tsx      # Game completion results
│   │   ├── HomePage.tsx             # Landing page
│   │   ├── HowToPlayPage.tsx       # Game instructions
│   │   ├── LeaderboardPage.tsx     # Leaderboards display
│   │   └── StatsPage.tsx           # User statistics
│   ├── router/                      # Client-side routing
│   │   ├── AppRouter.tsx           # Main router configuration
│   │   └── index.ts                # Router utilities
│   ├── services/                    # API and data services
│   │   ├── DataSyncService.ts      # Client-server data sync
│   │   ├── ServerApiService.ts     # API communication
│   │   └── TimeService.ts          # Time utilities
│   ├── utils/                       # Client utilities
│   │   ├── api.ts                  # API helper functions
│   │   └── GameDataConverter.ts    # Data format conversion
│   ├── hooks/                       # Custom React hooks
│   │   ├── useUnifiedLoader.ts     # Loading state management
│   │   └── useUser.ts              # User data hook
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                    # App entry point
│   └── index.css                   # Global styles
├── server/                          # Backend Express server
│   ├── controllers/                 # API route handlers
│   │   ├── comment.controller.ts   # Comment management
│   │   ├── game.controller.ts      # Game result processing
│   │   ├── internal.controller.ts  # Internal operations
│   │   ├── leaderboard.controller.ts # Leaderboard operations
│   │   └── user.controller.ts      # User management
│   ├── services/                    # Business logic services
│   │   ├── GameService.ts          # Game result processing
│   │   ├── LeaderboardService.ts   # Leaderboard calculations
│   │   ├── RedisService.ts         # Redis data operations
│   │   └── UserService.ts          # User data management
│   ├── middleware/                  # Express middleware
│   │   ├── asyncHandler.middleware.ts # Async error handling
│   │   ├── error.middleware.ts     # Error processing
│   │   └── validation.middleware.ts # Request validation
│   ├── routes/                      # API route definitions
│   │   ├── comment.router.ts       # Comment routes
│   │   ├── game.router.ts          # Game routes
│   │   ├── internal.router.ts      # Internal routes
│   │   ├── leaderboard.router.ts  # Leaderboard routes
│   │   ├── time.router.ts          # Time utilities
│   │   └── user.router.ts          # User routes
│   ├── config/                      # Server configuration
│   │   └── admins.ts               # Admin user management
│   ├── core/                        # Core server functionality
│   │   └── post.ts                 # Post management
│   ├── utils/                       # Server utilities
│   │   └── timeUtils.ts            # Server time management
│   └── index.ts                     # Server entry point
└── shared/                          # Shared types and utilities
    └── types/                       # TypeScript type definitions
        ├── api.ts                  # API request/response types
        ├── challenge.ts            # Challenge data types
        ├── client.ts               # Client-specific types
        ├── game.ts                 # Game data types
        ├── router.ts               # Router types
        ├── server.ts               # Server-specific types
        └── stats.ts                # Statistics types
```

## 🏗️ Building & Deployment

### Build Commands

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run build`        | Build both client and server      |
| `npm run build:client` | Build only client                 |
| `npm run build:server` | Build only server                 |
| `npm run check`        | Type check, lint, and format code |

### Deployment Process

1. **Build the Project**

   ```bash
   npm run build
   ```

2. **Deploy to Reddit**

   ```bash
   npm run deploy
   ```

   This uploads the built app to Reddit's servers.

3. **Publish for Review**
   ```bash
   npm run launch
   ```
   This submits the app for Reddit's review process.

### Configuration

The app is configured via `devvit.json`:

```json
{
  "$schema": "https://developers.reddit.com/schema/config-file.v1.json",
  "name": "dailyhomophone",
  "post": {
    "dir": "dist/client",
    "entrypoints": {
      "default": {
        "entry": "index.html"
      }
    }
  },
  "server": {
    "dir": "dist/server",
    "entry": "index.cjs"
  },
  "media": {},
  "menu": {
    "items": [
      {
        "label": "Create a new post",
        "description": "dailyhomophone",
        "location": "subreddit",
        "forUserType": "moderator",
        "endpoint": "/internal/menu/post-create"
      }
    ]
  },
  "triggers": {
    "onAppInstall": "/internal/on-app-install"
  },
  "dev": {
    "subreddit": <YOUR_TEST_SUBREDDIT>
  },
  "permissions": {
    "redis": true,
    "reddit": {
      "asUser": ["SUBMIT_COMMENT"]
    }
  }
}

```

## 🔧 Technical Details

### Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Platform**: Reddit Devvit Web
- **Database**: Redis (via Devvit)
- **Build Tools**: Vite, ESLint, Prettier

### Key Technologies

- **Devvit Web**: Reddit's developer platform for building immersive experiences
- **React**: Modern UI library with hooks and context
- **Express**: Web framework for API endpoints
- **Redis**: In-memory data store for game data and leaderboards (via Devvit)
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript development

### Architecture

#### **System Overview**

**The Daily Homophone** implements a sophisticated client-server architecture optimized for Reddit's Devvit platform:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Reddit UI     │    │   Devvit App    │    │   Redis Store   │
│   (Webview)     │◄──►│   (Client)      │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │    │   Game Engine   │    │   User Data      │
│   & Feedback    │    │   & Logic       │    │   & Progress     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### **Client Architecture**

- **React 19**: Modern UI with hooks and context
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tooling and HMR
- **Client-Side Routing**: Custom router implementation

#### **Server Architecture**

- **Express.js**: RESTful API server
- **Node.js**: Serverless backend
- **Redis**: In-memory data store
- **Devvit Platform**: Reddit integration layer

#### **Data Flow Architecture**

##### **1. Static Content Management**

```
Week Files → Daily Data → Game Data → Game Engine → UI Components
```

##### **2. Dynamic Data Synchronization**

```
User Actions → Client State → Server API → Redis Storage → Real-time Updates
```

##### **3. Game Result Processing**

```
Game Completion → Validation → Score Calculation → Database Update → Leaderboard Refresh
```

#### **Key Architectural Patterns**

##### **Separation of Concerns**

- **Presentation Layer**: React components and UI logic
- **Business Logic**: Game engine and scoring algorithms
- **Data Layer**: Redis storage and API services
- **Integration Layer**: Devvit platform and Reddit APIs

##### **State Management**

- **Client State**: React hooks and context for UI state
- **Server State**: Redis for persistent user data
- **Sync Strategy**: Real-time updates with conflict resolution

##### **Error Handling**

- **Graceful Degradation**: Fallback UI for network issues
- **Retry Logic**: Automatic reconnection attempts
- **User Feedback**: Clear error messages and recovery options

#### **Performance Optimizations**

##### **Client-Side**

- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Static content cached in bundle
- **Lazy Loading**: Components loaded on demand

##### **Server-Side**

- **Redis Optimization**: Efficient key structure and operations
- **API Caching**: Response caching for frequently accessed data
- **Connection Pooling**: Optimized database connections
- **Compression**: Gzip compression for API responses

## 📊 Game Data Management

### Game Flow Architecture

**The Daily Homophone** follows a sophisticated client-server architecture with static content management and dynamic user progress tracking:

#### 1. **Static Content System**

- **Location**: `src/client/game/data/assets/`
- **Structure**: Weekly data files (`week1.ts`, `week2.ts`, etc.)
- **Management**: Content is pre-defined and immutable
- **Access**: Via `dailyChallengesData.ts` and `gameData.ts`

#### 2. **Dynamic Progress Tracking**

- **Storage**: Redis database via Devvit platform
- **Tracking**: User completion status, scores, gems, streaks
- **Sync**: Real-time synchronization between client and server
- **Persistence**: All user progress saved server-side

#### 3. **Data Flow Process**

```
Static Content (Assets) → Game Data Converter → Game Engine → Server API → Redis Storage
```

### Daily Challenges Structure

Daily challenges are organized in weekly files within `src/client/game/data/assets/`:

#### **File Organization**

```
assets/
├── index.ts          # Exports all week data
├── week1.ts          # Week 1 challenges
├── week2.ts          # Week 2 challenges
├── week3.ts          # Week 3 challenges
├── week4.ts          # Week 4 challenges
└── change.log        # Content update log
```

#### **Data Structure**

```typescript
// DailyData type
{
  date: '2025-09-22',           // YYYY-MM-DD format
  themes: [
    {
      themeId: 'homophone-easy-2025-09-28-01',  // Unique identifier
      themeName: 'Spring Garden',                 // Display name
      content: 'The gardener had to sow the seeds...', // Text with homophone errors
      correctWords: ['sew', 'rose', 'whole', 'sun'],  // Correct homophones
      difficulty: 'easy' | 'medium' | 'hard',         // Difficulty level
      gemsEarn: 5,                                    // Gems awarded on completion
      pointPerCorrectWord: 10,                        // Base points per word
      themeBgImage: '/images/spring_bg.jpg',         // Background image
      hints: [                                        // 4-10 contextual hints
        'To stitch (not "plant seeds")',
        'Flower (not "stood up")',
        'Entire (not "opening")',
        'Star (not "male child")'
      ],
      isLocked: false,        // Unlock status (managed by server)
      isCompleted: false     // Completion status (managed by server)
    }
  ]
}
```

### Adding New Content

#### **Step-by-Step Process**

1. **Create New Week File**

   ```bash
   # Create new week file in assets/
   touch src/client/game/data/assets/week5.ts
   ```

2. **Define Daily Challenges**

   ```typescript
   // week5.ts
   import { DailyData } from '@shared/types/game';

   const day1: DailyData = {
     date: '2025-10-01',
     themes: [
       {
         themeId: 'homophone-easy-2025-10-01-01',
         themeName: 'Autumn Harvest',
         content: 'The farmer went to the fair to sell his produce...',
         correctWords: ['fare', 'pear', 'flour'],
         difficulty: 'easy',
         gemsEarn: 5,
         pointPerCorrectWord: 10,
         themeBgImage: '/images/autumn_bg.jpg',
         hints: [
           'Cost of travel (not "just")',
           'Fruit (not "pair")',
           'Baking ingredient (not "flower")'
         ]
       }
       // ... more themes
     ]
   };

   export const week5Challenges: DailyData[] = [day1, day2, day3, ...];
   ```

3. **Update Index File**

   ```typescript
   // assets/index.ts
   export * from './week5';
   ```

4. **Update Main Data File**

   ```typescript
   // dailyChallengesData.ts
   import { week5Challenges } from './assets';

   export const dailyChallengesData: DailyData[] = [
     ...week3Challenges,
     ...week4Challenges,
     ...week5Challenges, // Add new week
   ];
   ```

5. **Test Content**
   ```bash
   npm run check
   npm run dev
   # Verify content appears correctly in development
   ```

#### **Content Guidelines**

- **Theme IDs**: Must be unique across all content (`homophone-{difficulty}-{date}-{sequence}`)
- **Content Quality**: Ensure homophone errors are realistic and educational
- **Hint Quality**: Provide contextual hints that guide without giving away answers
- **Difficulty Progression**: Easy (3-4 words) → Medium (4-5 words) → Hard (5-6 words)
- **Gem Rewards**: Easy (5 gems), Medium (10 gems), Hard (15 gems)
- **Background Images**: Use descriptive, themed images in `/images/` directory

### Game Engine Mechanics

#### **Scoring System**

```typescript
// Progressive streak multiplier
Streak 1: Base points (e.g., 10 points)
Streak 2: Base + 50% bonus (e.g., 15 points)
Streak 3: Base + 100% bonus (e.g., 20 points)
Streak 4+: Increasing multipliers
```

#### **Hint System**

- **Free Hints**: 3 per game (no cost)
- **Gem Hints**: 1 gem = 3 additional hints
- **Penalty**: -2 points per gem hint used
- **Streak Reset**: Using any hint resets streak to 0

#### **Game State Management**

```typescript
interface GameState {
  currentWordIndex: number; // Current word being solved
  userAnswers: string[]; // Correctly found words
  score: number; // Total points earned
  hintsUsed: number; // Total hints used
  gems: number; // Available gems
  freeHintsUsed: number; // Free hints consumed
  isCompleted: boolean; // Game completion status
}
```

### Server-Side Data Management

#### **Game Result Processing**

```typescript
// GameService.saveGameResult()
1. Validate user can play challenge
2. Calculate gems earned from theme
3. Save game result to Redis
4. Update user points and gems
5. Track completion status
6. Update leaderboards
```

#### **Data Synchronization**

- **Client**: Static content + cached user data
- **Server**: Dynamic progress + real-time stats
- **Sync**: Automatic every 30 seconds + on game completion
- **Conflict Resolution**: Server data takes precedence

#### **Redis Data Structure**

```typescript
// User data keys
user:{username}:data          // User profile and stats
user:{username}:games         // All game results
user:{username}:daily:{date}  // Daily game results
user:{username}:stats         // Aggregated statistics

// Leaderboard keys
leaderboard:daily:{date}      // Daily leaderboard
leaderboard:weekly:{week}     // Weekly leaderboard
leaderboard:monthly:{month}   // Monthly leaderboard
leaderboard:alltime           // All-time leaderboard
```

### Content Update Workflow

#### **Development Process**

1. **Content Creation**: Write new challenges in week files
2. **Local Testing**: Verify content in development environment
3. **Build & Deploy**: Deploy to Reddit platform
4. **Production Testing**: Test on live subreddit
5. **Monitoring**: Track user engagement and completion rates

#### **Version Control**

- **Content Versioning**: Track changes in `change.log`
- **Rollback Capability**: Maintain previous week files
- **A/B Testing**: Test different difficulty progressions
- **Analytics**: Monitor completion rates and user feedback

### Performance Optimization

#### **Data Efficiency**

- **Lazy Loading**: Load content only when needed
- **Compression**: Minimize bundle size
- **Redis Optimization**: Efficient key structure

## 🎨 Customization

### Themes & Styling

- **Background Images**: Add to `src/client/public/images/`
- **Color Scheme**: Modify Tailwind classes in components

### Game Configuration

- **Scoring**: Adjust in `src/client/game/engine/GameEngine.ts`
- **Hints**: Modify hint system in game components
- **Difficulty**: Update challenge data structure

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**

   - Ensure Node.js 22+ is installed
   - Run `npm install` to update dependencies
   - Check TypeScript errors with `npm run check`

2. **Devvit Login Issues**

   - Run `npm run login` to re-authenticate
   - Check Reddit developer account permissions

3. **Development Server Issues**

   - Restart with `npm run dev`
   - Check port availability (7474 for Vite)

4. **Deployment Issues**
   - Ensure `npm run build` completes successfully
   - Check `devvit.json` configuration
   - Verify Redis permissions

## 🚀 Future Plans

### Upcoming Features

**The Daily Homophone** has exciting developments planned to enhance the gaming experience and community engagement:

- **Expanding Themes and Puzzles**: Adding more variety with diverse themes, seasonal content, and creative puzzle types to keep the game fresh and engaging
- **UI/UX Polish**: Implementing faster transitions, smoother animations, and enhanced visual feedback to create a more polished gaming experience
- **Achievements System**: Adding comprehensive achievement badges for various accomplishments
- **Streak Badges**: Visual recognition for consecutive daily completions and milestone streaks
- **Automated Winner Posts**: Automated custom posts on the game subreddit featuring daily winners (top 3 in daily, weekly, and monthly leaderboards) to celebrate achievements and drive community engagement

### Development Roadmap

These features are planned for future releases and will be implemented based on community feedback and technical feasibility. Stay tuned for updates!

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run check` to ensure code quality
5. Submit a pull request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Use descriptive commit messages

## 📄 License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub issues
- **Devvit Docs**: [developers.reddit.com](https://developers.reddit.com/)
- **Email Me**: sahedul.dev@gmail.com

---

**Happy Homophone Hunting!** 🎯✨

Built with ❤️ using [Devvit](https://developers.reddit.com/)
