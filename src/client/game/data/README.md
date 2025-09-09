# Daily Challenges Data Management

This directory contains the raw data for daily challenges, making it easy to add new content for each day.

## 📁 Files

- `dailyChallengesData.ts` - Main data file containing all daily challenges
- `dailyChallengesTemplate.ts` - Template for creating new daily challenges
- `DailyChallengeManager.ts` - Manager class that handles the data

## 🚀 Adding New Daily Challenges

### Step 1: Use the Template

1. Open `dailyChallengesTemplate.ts`
2. Copy the template structure
3. Modify it for your new day

### Step 2: Update the Data

1. Open `dailyChallengesData.ts`
2. Add your new day data to the `dailyChallengesData` array
3. Make sure the date is in YYYY-MM-DD format

### Step 3: Follow the Structure

Each day should have:

- **Date**: YYYY-MM-DD format
- **8 Challenges**: Each with unique theme and content
- **Varied Difficulty**: Mix of easy (5 gems), medium (10 gems), hard (20 gems)
- **Creative Themes**: Engaging and diverse themes
- **Homophone Content**: Sentences with incorrect words to find

## 📝 Challenge Structure

```typescript
{
  id: '2024-01-04-theme-name', // YYYY-MM-DD-theme-name
  themeName: 'Theme Name', // Creative theme name
  content: 'Content with incorrect words...', // Sentence with homophones
  correctWords: ['word1', 'word2', 'word3'], // Correct words to find
  themeBgImage: '/images/theme_bg.jpg', // Background image path
  difficulty: 'easy', // 'easy', 'medium', or 'hard'
  gemReward: 5, // 5, 10, or 20 gems
}
```

## 🎯 Content Guidelines

### Homophones to Use

- their/there/they're
- to/too/two
- your/you're
- its/it's
- break/brake
- great/grate
- knew/new
- rode/road
- through/threw
- right/write
- peace/piece
- see/sea
- sun/son
- flower/flour
- mail/male
- pair/pear
- bear/bare
- here/hear
- buy/bye/by
- meet/meat

### Difficulty Distribution

- **Easy (5 gems)**: 3 challenges - Simple homophones, short content
- **Medium (10 gems)**: 3 challenges - Moderate difficulty, medium content
- **Hard (20 gems)**: 2 challenges - Complex homophones, longer content

### Theme Ideas

- Fantasy (wizards, dragons, magic)
- Sci-Fi (space, robots, time travel)
- Adventure (pirates, explorers, treasure)
- Mystery (detectives, ghosts, puzzles)
- Historical (medieval, ancient, war)
- Modern (technology, city, business)
- Nature (ocean, forest, animals)
- Supernatural (vampires, werewolves, spirits)

## 🔧 Technical Details

### ID Format

- Use format: `YYYY-MM-DD-theme-name`
- Example: `2024-01-04-magic-academy`
- Use lowercase with hyphens

### Image Paths

- Place images in `/src/client/public/images/`
- Use descriptive names: `theme_bg.jpg`
- Ensure images are optimized for web

### Content Writing

- Write engaging, thematic sentences
- Include 3-5 homophones per challenge
- Make content appropriate for all ages
- Keep sentences readable and interesting

## 📊 Example Day Structure

```typescript
{
  date: '2024-01-04',
  challenges: [
    // Easy challenges (5 gems each)
    { difficulty: 'easy', gemReward: 5 },
    { difficulty: 'easy', gemReward: 5 },
    { difficulty: 'easy', gemReward: 5 },

    // Medium challenges (10 gems each)
    { difficulty: 'medium', gemReward: 10 },
    { difficulty: 'medium', gemReward: 10 },
    { difficulty: 'medium', gemReward: 10 },

    // Hard challenges (20 gems each)
    { difficulty: 'hard', gemReward: 20 },
    { difficulty: 'hard', gemReward: 20 },
  ],
}
```

## 🎮 Testing New Content

1. Add your new day data
2. Test in the application
3. Verify all challenges load correctly
4. Check that progression works (unlocking next challenge)
5. Ensure gem rewards are awarded properly

## 📈 Content Planning

### Weekly Themes

- **Monday**: Fantasy & Magic
- **Tuesday**: Sci-Fi & Technology
- **Wednesday**: Adventure & Exploration
- **Thursday**: Mystery & Puzzles
- **Friday**: Historical & Medieval
- **Saturday**: Modern & Contemporary
- **Sunday**: Nature & Supernatural

### Monthly Rotations

- Rotate themes monthly
- Keep popular themes
- Introduce new concepts
- Maintain difficulty balance

## 🔍 Quality Checklist

- [ ] All 8 challenges included
- [ ] Date format correct (YYYY-MM-DD)
- [ ] Unique IDs for each challenge
- [ ] Varied difficulty levels
- [ ] Clear homophones in content
- [ ] Correct words match content
- [ ] Appropriate gem rewards
- [ ] Engaging theme names
- [ ] Background images exist
- [ ] Content is age-appropriate
