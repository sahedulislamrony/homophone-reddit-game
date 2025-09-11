/* eslint-disable no-undef */
// Data validation utility for daily challenges
import { dailyChallengesData } from './dailyChallengesData';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateDailyChallengesData(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!dailyChallengesData || dailyChallengesData.length === 0) {
    errors.push('No daily challenge data found');
    return { isValid: false, errors, warnings };
  }

  // Validate each day
  dailyChallengesData.forEach((day, dayIndex) => {
    // Check date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
      errors.push(`Day ${dayIndex + 1}: Invalid date format '${day.date}'. Expected YYYY-MM-DD`);
    }

    // Check if date is valid
    const dateObj = new Date(day.date);
    if (isNaN(dateObj.getTime())) {
      errors.push(`Day ${dayIndex + 1}: Invalid date '${day.date}'`);
    }

    // Check challenges array
    if (!day.challenges || day.challenges.length === 0) {
      errors.push(`Day ${dayIndex + 1}: No challenges found`);
      return;
    }

    // Check if exactly 8 challenges
    if (day.challenges.length !== 8) {
      warnings.push(`Day ${dayIndex + 1}: Expected 8 challenges, found ${day.challenges.length}`);
    }

    // Validate each challenge
    day.challenges.forEach((challenge, challengeIndex) => {
      const challengeId = `Day ${dayIndex + 1}, Challenge ${challengeIndex + 1}`;

      // Check required fields
      if (!challenge.id) {
        errors.push(`${challengeId}: Missing ID`);
      }
      if (!challenge.themeName) {
        errors.push(`${challengeId}: Missing theme name`);
      }
      if (!challenge.content) {
        errors.push(`${challengeId}: Missing content`);
      }
      if (!challenge.correctWords || challenge.correctWords.length === 0) {
        errors.push(`${challengeId}: Missing or empty correct words`);
      }
      if (!challenge.themeBgImage) {
        errors.push(`${challengeId}: Missing background image`);
      }
      if (!challenge.difficulty) {
        errors.push(`${challengeId}: Missing difficulty`);
      }
      if (challenge.gemReward === undefined || challenge.gemReward === null) {
        errors.push(`${challengeId}: Missing gem reward`);
      }

      // Check ID format
      if (challenge.id && !challenge.id.startsWith(day.date)) {
        warnings.push(`${challengeId}: ID '${challenge.id}' doesn't start with date '${day.date}'`);
      }

      // Check difficulty
      if (challenge.difficulty && !['easy', 'medium', 'hard'].includes(challenge.difficulty)) {
        errors.push(
          `${challengeId}: Invalid difficulty '${challenge.difficulty}'. Expected easy, medium, or hard`
        );
      }

      // Check gem reward
      if (challenge.gemReward !== undefined) {
        const expectedReward =
          challenge.difficulty === 'easy'
            ? 5
            : challenge.difficulty === 'medium'
              ? 10
              : challenge.difficulty === 'hard'
                ? 20
                : 0;
        if (challenge.gemReward !== expectedReward) {
          warnings.push(
            `${challengeId}: Gem reward ${challenge.gemReward} doesn't match difficulty ${challenge.difficulty} (expected ${expectedReward})`
          );
        }
      }

      // Check content length
      if (challenge.content && challenge.content.length < 20) {
        warnings.push(
          `${challengeId}: Content seems too short (${challenge.content.length} characters)`
        );
      }

      // Check correct words
      if (challenge.correctWords && challenge.correctWords.length < 2) {
        warnings.push(`${challengeId}: Very few correct words (${challenge.correctWords.length})`);
      }

      // Check for duplicate IDs
      const duplicateIds = day.challenges.filter((c) => c.id === challenge.id);
      if (duplicateIds.length > 1) {
        errors.push(`${challengeId}: Duplicate ID '${challenge.id}'`);
      }
    });

    // Check difficulty distribution
    const difficultyCount = {
      easy: day.challenges.filter((c) => c.difficulty === 'easy').length,
      medium: day.challenges.filter((c) => c.difficulty === 'medium').length,
      hard: day.challenges.filter((c) => c.difficulty === 'hard').length,
    };

    if (difficultyCount.easy < 2) {
      warnings.push(`Day ${dayIndex + 1}: Very few easy challenges (${difficultyCount.easy})`);
    }
    if (difficultyCount.hard > 4) {
      warnings.push(`Day ${dayIndex + 1}: Many hard challenges (${difficultyCount.hard})`);
    }
  });

  // Check for duplicate dates
  const dates = dailyChallengesData.map((day) => day.date);
  const duplicateDates = dates.filter((date, index) => dates.indexOf(date) !== index);
  if (duplicateDates.length > 0) {
    errors.push(`Duplicate dates found: ${duplicateDates.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Helper function to print validation results
export function printValidationResults(result: ValidationResult): void {
  console.log('🔍 Daily Challenges Data Validation\n');

  if (result.isValid) {
    console.log('✅ All data is valid!');
  } else {
    console.log('❌ Validation failed with errors:');
    result.errors.forEach((error) => console.log(`  • ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach((warning) => console.log(`  • ${warning}`));
  }

  console.log(`\n📊 Summary: ${result.errors.length} errors, ${result.warnings.length} warnings`);
}

// Run validation if this file is executed directly
if (require.main === module) {
  const result = validateDailyChallengesData();
  printValidationResults(result);
  process.exit(result.isValid ? 0 : 1);
}
