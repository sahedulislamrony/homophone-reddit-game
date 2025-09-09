// Template for adding new daily challenge data
// Copy this template and modify it for each new day

export const dailyChallengeTemplate = {
  date: '2024-01-04', // Change this to your desired date (YYYY-MM-DD format)
  challenges: [
    {
      id: '2024-01-04-theme-name-1', // Change to: YYYY-MM-DD-theme-name
      themeName: 'Theme Name 1', // Change to your theme name
      content:
        'Your content with incorrect words here. Make sure to include homophones that need to be corrected.',
      correctWords: ['word1', 'word2', 'word3', 'word4'], // List the correct words to find
      themeBgImage: '/images/theme1_bg.jpg', // Change to your image path
      difficulty: 'easy', // 'easy', 'medium', or 'hard'
      gemReward: 5, // 5 for easy, 10 for medium, 20 for hard
    },
    {
      id: '2024-01-04-theme-name-2',
      themeName: 'Theme Name 2',
      content:
        'Another content with incorrect words here. Include different homophones for variety.',
      correctWords: ['word1', 'word2', 'word3'],
      themeBgImage: '/images/theme2_bg.jpg',
      difficulty: 'medium',
      gemReward: 10,
    },
    {
      id: '2024-01-04-theme-name-3',
      themeName: 'Theme Name 3',
      content: 'Third content with incorrect words. Make it challenging and engaging.',
      correctWords: ['word1', 'word2', 'word3', 'word4', 'word5'],
      themeBgImage: '/images/theme3_bg.jpg',
      difficulty: 'hard',
      gemReward: 20,
    },
    {
      id: '2024-01-04-theme-name-4',
      themeName: 'Theme Name 4',
      content: 'Fourth content with incorrect words. Keep the theme consistent.',
      correctWords: ['word1', 'word2', 'word3'],
      themeBgImage: '/images/theme4_bg.jpg',
      difficulty: 'easy',
      gemReward: 5,
    },
    {
      id: '2024-01-04-theme-name-5',
      themeName: 'Theme Name 5',
      content: 'Fifth content with incorrect words. Mix up the difficulty levels.',
      correctWords: ['word1', 'word2', 'word3', 'word4'],
      themeBgImage: '/images/theme5_bg.jpg',
      difficulty: 'medium',
      gemReward: 10,
    },
    {
      id: '2024-01-04-theme-name-6',
      themeName: 'Theme Name 6',
      content: 'Sixth content with incorrect words. Make it interesting and thematic.',
      correctWords: ['word1', 'word2', 'word3'],
      themeBgImage: '/images/theme6_bg.jpg',
      difficulty: 'hard',
      gemReward: 20,
    },
    {
      id: '2024-01-04-theme-name-7',
      themeName: 'Theme Name 7',
      content: 'Seventh content with incorrect words. Keep the story flowing.',
      correctWords: ['word1', 'word2', 'word3', 'word4'],
      themeBgImage: '/images/theme7_bg.jpg',
      difficulty: 'easy',
      gemReward: 5,
    },
    {
      id: '2024-01-04-theme-name-8',
      themeName: 'Theme Name 8',
      content: 'Eighth content with incorrect words. End with a satisfying conclusion.',
      correctWords: ['word1', 'word2', 'word3'],
      themeBgImage: '/images/theme8_bg.jpg',
      difficulty: 'medium',
      gemReward: 10,
    },
  ],
};

// Instructions for adding new daily challenges:
/*
1. Copy the template above
2. Change the date to your desired date (YYYY-MM-DD format)
3. Update each challenge:
   - id: Use format YYYY-MM-DD-theme-name (lowercase, hyphens)
   - themeName: Your creative theme name
   - content: Write a sentence with homophones (incorrect words)
   - correctWords: Array of the correct words to find
   - themeBgImage: Path to your background image
   - difficulty: 'easy', 'medium', or 'hard'
   - gemReward: 5 for easy, 10 for medium, 20 for hard

4. Add the new day data to the dailyChallengesData array in dailyChallengesData.ts
5. Make sure to include 8 challenges per day
6. Vary the difficulty levels for better gameplay
7. Use creative and engaging themes
8. Ensure the content has clear homophones that players can identify

Example homophones to use:
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
*/
