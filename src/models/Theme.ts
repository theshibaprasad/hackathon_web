import mongoose, { Document, Schema } from 'mongoose';

export interface ITheme extends Document {
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSchema = new Schema<ITheme>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Theme || mongoose.model<ITheme>('Theme', ThemeSchema);
