import mongoose, { Document, Schema } from 'mongoose';

export interface IProblemStatement extends Document {
  title: string;
  description: string; // Rich text content (HTML)
  themeId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemStatementSchema = new Schema<IProblemStatement>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  themeId: {
    type: Schema.Types.ObjectId,
    ref: 'Theme',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.ProblemStatement || mongoose.model<IProblemStatement>('ProblemStatement', ProblemStatementSchema);
