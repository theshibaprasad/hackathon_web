const mongoose = require('mongoose');
require('dotenv').config();

// Define the Settings schema
const SettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add static methods
SettingsSchema.statics.getSetting = async function(key, defaultValue = null) {
  try {
    const setting = await this.findOne({ key });
    return setting ? setting.value : defaultValue;
  } catch (error) {
    console.error('Error getting setting:', error);
    return defaultValue;
  }
};

SettingsSchema.statics.setSetting = async function(key, value, description = '') {
  try {
    const setting = await this.findOneAndUpdate(
      { key },
      { 
        key, 
        value, 
        description,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true 
      }
    );
    return setting;
  } catch (error) {
    console.error('Error setting setting:', error);
    throw error;
  }
};

const Settings = mongoose.model('Settings', SettingsSchema);

async function initSpecialPricingSetting() {
  try {
    // Connect to MongoDB with the existing connection string
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'hackathon_web' // Specify the database name
    });
    console.log('Connected to MongoDB - hackathon_web database');

    // Initialize special pricing setting
    await Settings.setSetting(
      'special_pricing_enabled',
      false, // Default to disabled
      'Controls whether the special 2 rupees pricing feature is enabled for users'
    );

    console.log('✅ Special pricing setting initialized successfully');
    console.log('Setting: special_pricing_enabled = false (disabled by default)');
    
  } catch (error) {
    console.error('❌ Error initializing special pricing setting:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initSpecialPricingSetting();
