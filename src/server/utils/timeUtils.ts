/**
 * Server-side Time Utilities
 * Provides consistent time handling across all server components
 * All time calculations should use this utility to ensure synchronization
 */

/**
 * Get the current server date in YYYY-MM-DD format
 * This is the standard date format used throughout the app
 */
export function getServerDate(): string {
  return new Date().toISOString().split('T')[0] || '';
}

/**
 * Get the current server time as ISO string
 */
export function getServerTime(): string {
  return new Date().toISOString();
}

/**
 * Get the current server time as Date object
 */
export function getServerDateObject(): Date {
  return new Date();
}

/**
 * Format a date string to YYYY-MM-DD format
 */
export function formatToDateString(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString().split('T')[0] || '';
  }
  return date.toISOString().split('T')[0] || '';
}

/**
 * Check if a date string is today (server time)
 */
export function isToday(dateString: string): boolean {
  return dateString === getServerDate();
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
export function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0] || '';
}

/**
 * Get tomorrow's date in YYYY-MM-DD format
 */
export function getTomorrow(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0] || '';
}
