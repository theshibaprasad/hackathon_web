import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectSubmission extends Document {
  teamId: mongoose.Types.ObjectId;
  teamName: string;
  projectName: string;
  description: string;
  githubRepo: string;
  githubValidation: {
    isPublic: boolean;
    hasSetupMd: boolean;
    hasTeamNamePdf: boolean;
    validatedAt: Date;
  };
  submittedBy: mongoose.Types.ObjectId;
  submittedAt: Date;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSubmissionSchema = new Schema<IProjectSubmission>({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
    unique: true, // Only one submission per team
  },
  teamName: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  githubRepo: {
    type: String,
    required: true,
    trim: true,
  },
  githubValidation: {
    isPublic: {
      type: Boolean,
      default: false,
    },
    hasSetupMd: {
      type: Boolean,
      default: false,
    },
    hasTeamNamePdf: {
      type: Boolean,
      default: false,
    },
    validatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'approved', 'rejected'],
    default: 'submitted',
  },
  reviewNotes: {
    type: String,
    trim: true,
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
// Note: teamId already has a unique index from the unique: true constraint
ProjectSubmissionSchema.index({ submittedBy: 1 });
ProjectSubmissionSchema.index({ status: 1 });
ProjectSubmissionSchema.index({ submittedAt: -1 });

export const ProjectSubmission = mongoose.models.ProjectSubmission || mongoose.model<IProjectSubmission>('ProjectSubmission', ProjectSubmissionSchema);


