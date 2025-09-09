# Game Module Structure

This module contains the refactored game functionality, organized into logical components:

## 📁 Structure

```
src/client/game/
├── components/           # UI Components
│   ├── GameCard.tsx     # Main game interface card
│   ├── FeedbackMessage.tsx # User feedback display
│   ├── GameComplete.tsx # Game completion screen
│   ├── GameHeader.tsx   # Game header with navigation
│   └── index.ts         # Component exports
├── engine/              # Game Logic
│   └── GameEngine.ts    # Core game engine class
├── data/                # Game Data Management
│   ├── GameDataManager.ts # Data persistence and state management
│   └── sampleGames.ts   # Sample game data and utilities
├── assets/              # Game Assets & Themes
│   └── GameAssets.ts    # Theme configurations and asset management
├── GamePage.tsx         # Main game page component
├── index.ts            # Module exports
└── README.md           # This file
```

## 🎮 Components

### GameCard
The main game interface containing:
- Score display
- Hint button
- Content with highlighted incorrect words
- Progress bar
- Input field and submit button

### FeedbackMessage
Displays user feedback with appropriate styling:
- Correct answers (green)
- Wrong answers (red)
- Hints (yellow)

### GameComplete
Shows the final score and navigation back to home.

### GameHeader
Simple header with theme name and back button.

## ⚙️ Game Engine

The `GameEngine` class handles all game logic:
- Answer validation
- Score calculation
- Progress tracking
- Hint generation
- State management

## 📊 Data Management

### GameDataManager
Singleton class for managing game data:
- Current game state
- Data persistence (localStorage)
- State synchronization

### Sample Games
Pre-defined game content with different themes:
- Harry Potter
- Space Adventure
- Ocean Exploration
- Medieval Times

## 🎨 Assets & Themes

### GameAssets
Theme configurations with:
- Background images
- Color schemes
- Fallback gradients
- Asset management utilities

## 🚀 Usage

```typescript
import { GamePage } from '@client/game';

// Use the refactored game page
<GamePage />
```

## 🔧 Extensibility

The modular structure makes it easy to:
- Add new game themes
- Create new UI components
- Implement different game modes
- Add data persistence
- Extend game logic
