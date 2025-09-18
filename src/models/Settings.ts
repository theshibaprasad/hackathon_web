import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  value: any;
  description?: string;
  updatedAt: Date;
  createdAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create a method to get a setting by key
SettingsSchema.statics.getSetting = async function(key: string, defaultValue: any = null) {
  try {
    const setting = await this.findOne({ key });
    return setting ? setting.value : defaultValue;
  } catch (error) {
    console.error('Error getting setting:', error);
    return defaultValue;
  }
};

// Create a method to set a setting by key
SettingsSchema.statics.setSetting = async function(key: string, value: any, description?: string) {
  try {
    const setting = await this.findOneAndUpdate(
      { key },
      { 
        key, 
        value, 
        description: description || '',
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

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
