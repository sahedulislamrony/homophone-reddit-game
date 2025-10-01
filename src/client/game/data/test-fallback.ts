/**
 * Test file to demonstrate the fallback mechanism
 * This file can be run to verify that the fallback system works correctly
 */

import { getChallengesForDate, isFallbackData, getAvailableDates } from './dailyChallengesData';

// Test the fallback mechanism
console.log('=== Testing Fallback Mechanism ===\n');

// Get available official dates
const availableDates = getAvailableDates();
console.log('Available official dates:', availableDates);

// Test with an official date
const officialDate = availableDates[0];
if (officialDate) {
  console.log(`\nTesting official date: ${officialDate}`);
  const officialData = getChallengesForDate(officialDate);
  console.log(`- Is fallback data: ${isFallbackData(officialDate)}`);
  console.log(`- Number of themes: ${officialData.themes.length}`);
  console.log(`- First theme ID: ${officialData.themes[0]?.themeId}`);
}

// Test with a non-existent date (should use fallback)
const testDate = '2025-12-25'; // Christmas date not in our data
console.log(`\nTesting fallback date: ${testDate}`);
const fallbackData = getChallengesForDate(testDate);
console.log(`- Is fallback data: ${isFallbackData(testDate)}`);
console.log(`- Date returned: ${fallbackData.date}`);
console.log(`- Number of themes: ${fallbackData.themes.length}`);
console.log(`- First theme ID: ${fallbackData.themes[0]?.themeId}`);
console.log(`- Theme names: ${fallbackData.themes.map((t) => t.themeName).join(', ')}`);

// Test with another non-existent date
const anotherTestDate = '2025-01-01'; // New Year's Day
console.log(`\nTesting another fallback date: ${anotherTestDate}`);
const anotherFallbackData = getChallengesForDate(anotherTestDate);
console.log(`- Is fallback data: ${isFallbackData(anotherTestDate)}`);
console.log(`- Date returned: ${anotherFallbackData.date}`);
console.log(`- First theme ID: ${anotherFallbackData.themes[0]?.themeId}`);

// Verify that theme IDs are unique for different dates
console.log('\n=== Verifying Unique Theme IDs ===');
console.log(`Christmas theme 1 ID: ${fallbackData.themes[0]?.themeId}`);
console.log(`New Year theme 1 ID: ${anotherFallbackData.themes[0]?.themeId}`);
console.log(
  `IDs are different: ${fallbackData.themes[0]?.themeId !== anotherFallbackData.themes[0]?.themeId}`
);

console.log('\n=== Test Complete ===');
