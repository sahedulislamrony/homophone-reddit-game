#!/usr/bin/env node

/**
 * Daily Challenge Generator
 * 
 * This script helps generate new daily challenge data
 * Run with: node generateDailyChallenge.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const themes = [
  'Fantasy', 'Sci-Fi', 'Adventure', 'Mystery', 'Historical', 
  'Modern', 'Nature', 'Supernatural', 'Magic', 'Space',
  'Pirate', 'Dragon', 'Robot', 'Ghost', 'Ninja',
  'Vampire', 'Treasure', 'Alien', 'Fairy', 'Samurai'
];

const difficulties = ['easy', 'medium', 'hard'];
const gemRewards = { easy: 5, medium: 10, hard: 20 };

const homophones = [
  'their/there/they\'re', 'to/too/two', 'your/you\'re', 'its/it\'s',
  'break/brake', 'great/grate', 'knew/new', 'rode/road',
  'through/threw', 'right/write', 'peace/piece', 'see/sea',
  'sun/son', 'flower/flour', 'mail/male', 'pair/pear',
  'bear/bare', 'here/hear', 'buy/bye/by', 'meet/meat'
];

async function generateDailyChallenge() {
  console.log('🎮 Daily Challenge Generator\n');
  
  const date = await question('Enter date (YYYY-MM-DD): ');
  console.log(`\nGenerating challenges for ${date}...\n`);
  
  const challenges = [];
  
  for (let i = 0; i < 8; i++) {
    console.log(`\n--- Challenge ${i + 1} ---`);
    
    const themeName = await question(`Theme name: `);
    const content = await question(`Content (with homophones): `);
    const correctWordsInput = await question(`Correct words (comma-separated): `);
    const correctWords = correctWordsInput.split(',').map(w => w.trim());
    const difficulty = await question(`Difficulty (easy/medium/hard): `);
    const themeBgImage = await question(`Background image path: `);
    
    const challenge = {
      id: `${date}-${themeName.toLowerCase().replace(/\s+/g, '-')}`,
      themeName,
      content,
      correctWords,
      themeBgImage,
      difficulty,
      gemReward: gemRewards[difficulty]
    };
    
    challenges.push(challenge);
    console.log(`✅ Challenge ${i + 1} created`);
  }
  
  const dailyChallenge = {
    date,
    challenges
  };
  
  console.log('\n🎉 Daily Challenge Generated!\n');
  console.log('Copy this code to your dailyChallengesData.ts file:\n');
  console.log(JSON.stringify(dailyChallenge, null, 2));
  
  rl.close();
}

// Helper function to suggest homophones
function suggestHomophones() {
  console.log('\n💡 Suggested homophones:');
  homophones.forEach((pair, index) => {
    console.log(`${index + 1}. ${pair}`);
  });
  console.log('');
}

// Main execution
console.log('Welcome to the Daily Challenge Generator!');
console.log('This tool will help you create new daily challenge data.\n');

suggestHomophones();
generateDailyChallenge().catch(console.error);
