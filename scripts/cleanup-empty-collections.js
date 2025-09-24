#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function cleanupEmptyCollections() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections`);

    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      
      console.log(`📁 Collection: ${collectionName} - Documents: ${count}`);
      
      // If collection is empty, drop it
      if (count === 0) {
        console.log(`🗑️  Dropping empty collection: ${collectionName}`);
        await db.collection(collectionName).drop();
        console.log(`✅ Dropped: ${collectionName}`);
      }
    }

    console.log('🎉 Cleanup completed successfully');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run cleanup
cleanupEmptyCollections();
