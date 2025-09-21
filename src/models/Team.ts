import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember {
  userId: string;
  name: string;
  email: string;
  phone: string;
}

export interface ITeam extends Document {
  _id: string;
  teamName: string;
  leader: {
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
  members: ITeamMember[];
  themeId?: string;
  problemId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const TeamSchema: Schema = new Schema({
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  leader: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  members: [TeamMemberSchema],
  themeId: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  problemId: {
    type: String,
    required: false,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
TeamSchema.index({ 'leader.userId': 1 });
TeamSchema.index({ 'members.userId': 1 });
TeamSchema.index({ themeId: 1 });
TeamSchema.index({ problemId: 1 });

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
