import { NextRequest } from 'next/server';

class CleanupService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) {
      console.log('🧹 Cleanup service is already running');
      return;
    }

    console.log('🚀 Starting cleanup service - runs every 5 minutes');
    this.isRunning = true;

    // Run immediately on start
    this.runCleanup();

    // Then run every 5 minutes
    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, 5 * 60 * 1000); // 5 minutes
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Cleanup service stopped');
  }

  private async runCleanup() {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/cleanup/unverified-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Cleanup completed: ${data.message}`);
      } else {
        console.error('❌ Cleanup failed:', await response.text());
      }
    } catch (error) {
      console.error('❌ Cleanup service error:', error);
    }
  }

  isServiceRunning() {
    return this.isRunning;
  }
}

// Create singleton instance
const cleanupService = new CleanupService();

export default cleanupService;
