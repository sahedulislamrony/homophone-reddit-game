/**
 * Centralized Time Service
 * Provides consistent time handling across all components
 * All time calculations should use this service to ensure synchronization
 */

export class TimeService {
  private static serverTimeOffset: number | null = null;
  private static lastSyncTime: number = 0;
  private static readonly SYNC_INTERVAL = 2 * 60 * 1000; // 2 minutes

  /**
   * Get the current server date in YYYY-MM-DD format
   * This is the standard date format used throughout the app
   */
  static async getToday(): Promise<string> {
    try {
      // If we have a cached offset and it's recent, use it
      if (this.serverTimeOffset !== null && Date.now() - this.lastSyncTime < this.SYNC_INTERVAL) {
        const serverTime = new Date(Date.now() + this.serverTimeOffset);
        return serverTime.toISOString().split('T')[0] || '';
      }

      // Fetch server time with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch('/api/time', {
        signal: controller.signal,
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      const serverTime = new Date(data.serverTime);
      const clientTime = new Date();

      // Validate server time is reasonable (not too far in past/future)
      const timeDiff = Math.abs(serverTime.getTime() - clientTime.getTime());
      if (timeDiff > 24 * 60 * 60 * 1000) {
        // More than 24 hours difference
        console.warn('Server time seems incorrect, using local time');
        return new Date().toISOString().split('T')[0] || '';
      }

      // Calculate offset between server and client time
      this.serverTimeOffset = serverTime.getTime() - clientTime.getTime();
      this.lastSyncTime = Date.now();

      return serverTime.toISOString().split('T')[0] || '';
    } catch (error) {
      console.warn('Failed to fetch server time, using local time:', error);
      // Fallback to local time if server time fetch fails
      return new Date().toISOString().split('T')[0] || '';
    }
  }

  /**
   * Get the current server time as a Date object
   */
  static async getServerTime(): Promise<Date> {
    try {
      if (this.serverTimeOffset !== null && Date.now() - this.lastSyncTime < this.SYNC_INTERVAL) {
        return new Date(Date.now() + this.serverTimeOffset);
      }

      const response = await fetch('/api/time');
      if (!response.ok) {
        throw new Error('Failed to fetch server time');
      }

      const data = await response.json();
      const serverTime = new Date(data.serverTime);
      const clientTime = new Date();

      this.serverTimeOffset = serverTime.getTime() - clientTime.getTime();
      this.lastSyncTime = Date.now();

      return serverTime;
    } catch (error) {
      console.warn('Failed to fetch server time, using local time:', error);
      return new Date();
    }
  }

  /**
   * Get formatted date string for display
   */
  static async getFormattedDate(): Promise<string> {
    const serverTime = await this.getServerTime();
    return serverTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Format a date string (YYYY-MM-DD) to a readable format like "September 12, 2025"
   */
  static formatDate(dateString: string): string {
    if (!dateString) return 'Invalid Date';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.warn('Failed to format date:', dateString, error);
      return 'Invalid Date';
    }
  }

  /**
   * Check if a given date is today (server time)
   */
  static async isToday(dateString: string): Promise<boolean> {
    const today = await this.getToday();
    return dateString === today;
  }

  /**
   * Get yesterday's date in YYYY-MM-DD format
   */
  static async getYesterday(): Promise<string> {
    const serverTime = await this.getServerTime();
    const yesterday = new Date(serverTime);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0] || '';
  }

  /**
   * Get tomorrow's date in YYYY-MM-DD format
   */
  static async getTomorrow(): Promise<string> {
    const serverTime = await this.getServerTime();
    const tomorrow = new Date(serverTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0] || '';
  }

  /**
   * Force refresh of server time (useful for debugging)
   */
  static async refreshServerTime(): Promise<void> {
    this.serverTimeOffset = null;
    this.lastSyncTime = 0;
    await this.getToday();
  }
}

// Export convenience functions
export const getToday = () => TimeService.getToday();
export const getServerTime = () => TimeService.getServerTime();
export const getFormattedDate = () => TimeService.getFormattedDate();
export const formatDate = (dateString: string) => TimeService.formatDate(dateString);
export const isToday = (dateString: string) => TimeService.isToday(dateString);
export const getYesterday = () => TimeService.getYesterday();
export const getTomorrow = () => TimeService.getTomorrow();
