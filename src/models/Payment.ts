import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  _id: string;
  userId: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  isEarlyBird: boolean;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  invoiceUrl?: string;
  errorReason?: string;
  errorCode?: string;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
    required: true
  },
  isEarlyBird: {
    type: Boolean,
    default: false,
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    trim: true,
    sparse: true // Allow multiple null values
  },
  razorpaySignature: {
    type: String,
    trim: true
  },
  invoiceUrl: {
    type: String,
    trim: true
  },
  errorReason: {
    type: String,
    trim: true
  },
  errorCode: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ paymentStatus: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ createdAt: -1 });

// Ensure razorpayOrderId is unique
PaymentSchema.index({ razorpayOrderId: 1 }, { unique: true });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
