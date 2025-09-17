#!/usr/bin/env node

const cleanupService = require('../src/lib/cleanupService.ts');

// Start the cleanup service
cleanupService.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping cleanup service...');
  cleanupService.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, stopping cleanup service...');
  cleanupService.stop();
  process.exit(0);
});

console.log('🚀 Cleanup service startup script loaded');
