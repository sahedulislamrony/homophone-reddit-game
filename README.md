# 🎯 The Daily Homophone

A Reddit-based word game where players hunt down impostor words and replace them with correct homophones. Built with Devvit, React, and TypeScript.

## 🎮 Game Overview

**The Daily Homophone** is an engaging word puzzle game that challenges players to identify and correct homophone errors in themed text passages. Players earn points, build streaks, and compete on leaderboards while improving their language skills.

### Key Features

- **Daily Challenges**: Fresh content every day with themed challenges
- **Progressive Difficulty**: Easy (5 gems), Medium (10 gems), Hard (20 gems)
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

### Gameplay Steps

1. **Read the Text**: Carefully examine the themed passage
2. **Identify Errors**: Look for words that sound correct but are spelled wrong
3. **Type Corrections**: Enter the correct homophone in the input field
4. **Submit Answer**: Get immediate feedback and earn points
5. **Build Streaks**: Consecutive correct answers earn bonus points

### Example

```
Given: "I went to the store and board a car."
Correct: "I went to the store and bought a car."
Explanation: "board" should be "bought" - they sound similar but have different meanings.
```

### Scoring System

- **Base Points**: Varies by challenge difficulty
- **Streak Bonuses**:
  - 2nd consecutive: +50% bonus
  - 3rd+ consecutive: Increasing multipliers
- **Penalties**:
  - Wrong answer: Streak resets to 0
  - Using hints: -2 points, streak resets
- **Time Bonuses**: Optional time-based scoring

### Hints & Rewards

- **Free Hints**: 3 per challenge
- **Gem Hints**: Get additional hints by using gems
- **Gems**: Earned for challenge completions
- **Leaderboards**: Compete with other players globally

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
├── client/                 # Frontend React app
│   ├── components/        # Reusable UI components
│   ├── game/             # Game-specific components & logic
│   ├── pages/            # Main app pages
│   ├── services/         # API and data services
│   └── utils/            # Client utilities
├── server/               # Backend Express server
│   ├── controllers/      # API route handlers
│   ├── services/         # Business logic services
│   ├── middleware/       # Express middleware
│   └── routes/           # API route definitions
└── shared/               # Shared types and utilities
    └── types/            # TypeScript type definitions
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

- **Client-Server**: React frontend communicates with Express backend
- **Real-time Sync**: Server-based data synchronization
- **Redis Storage**: Efficient data persistence and leaderboard operations
- **UGC Integration**: Seamless integration with Reddit's native commenting system for user-generated content

## 📊 Game Data Management

### Daily Challenges

Daily challenges are stored in `src/client/game/data/dailyChallengesData.ts`. Each day includes:

- **Themed Challenges**: Unique content with different difficulty levels
- **Progressive Unlocking**: Complete challenges to unlock harder ones
- **Gem Rewards**: 5, 10, or 20 gems based on difficulty
- **Server Time**: All times based on server timezone

### Adding New Content

1. **Update Data**: Add to `dailyChallengesData.ts` array
2. **Follow Structure**: Include all required fields (date, theme, content, etc.)
3. **Test**: Verify in development environment

### Data Structure

```typescript
{
  id: '2024-01-04-theme-name',
  themeName: 'Theme Name',
  content: 'Content with incorrect words...',
  correctWords: ['word1', 'word2', 'word3'],
  themeBgImage: '/images/theme_bg.jpg',
  difficulty: 'easy' | 'medium' | 'hard',
  gemReward: 5 | 10 | 20
}
```

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
   - Check TypeScript errors with `npm run type-check`

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

## 📈 Performance

### Optimization Features

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Redis Caching**: Efficient data storage and retrieval
- **Lazy Loading**: Components loaded on demand

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

### Community

- **Reddit**: Join the discussion in your test subreddit
- **Discord**: Connect with other Devvit developers
- **UGC Features**: Engage with the community through game result comments and shared experiences

---

**Happy Homophone Hunting!** 🎯✨

Built with ❤️ using [Devvit](https://developers.reddit.com/)
