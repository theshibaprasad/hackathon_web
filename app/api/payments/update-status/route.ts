import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';
import { sendPaymentConfirmationEmail } from '@/lib/emailService';

export async function PUT(request: NextRequest) {
  try {
    const { 
      razorpayOrderId, 
      paymentStatus, 
      razorpayPaymentId, 
      razorpaySignature,
      invoiceUrl 
    } = await request.json();

    if (!razorpayOrderId || !paymentStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['pending', 'success', 'failed'].includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find payment by razorpayOrderId
    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const updateData: any = { paymentStatus };
    
    if (razorpayPaymentId) {
      updateData.razorpayPaymentId = razorpayPaymentId;
    }
    
    if (razorpaySignature) {
      updateData.razorpaySignature = razorpaySignature;
    }
    
    if (invoiceUrl) {
      updateData.invoiceUrl = invoiceUrl;
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      updateData,
      { new: true }
    );

    // If payment is successful, update user's payment status and clean up pending payments
    if (paymentStatus === 'success') {
      // Remove all other pending payments for this user when payment is successful
      await Payment.deleteMany({
        userId: payment.userId,
        paymentStatus: 'pending',
        _id: { $ne: payment._id } // Exclude the current successful payment
      });

      await User.findByIdAndUpdate(payment.userId, {
        isBoarding: true // Set to true after successful payment
      });
    }

    // If payment fails, also clean up other pending payments to prevent accumulation
    if (paymentStatus === 'failed') {
      // Remove all other pending payments for this user when payment fails
      await Payment.deleteMany({
        userId: payment.userId,
        paymentStatus: 'pending',
        _id: { $ne: payment._id } // Exclude the current failed payment
      });
    }

    const responseData: any = {
      success: true,
      payment: {
        id: updatedPayment._id,
        userId: updatedPayment.userId,
        paymentStatus: updatedPayment.paymentStatus,
        isEarlyBird: updatedPayment.isEarlyBird,
        razorpayOrderId: updatedPayment.razorpayOrderId,
        razorpayPaymentId: updatedPayment.razorpayPaymentId,
        razorpaySignature: updatedPayment.razorpaySignature,
        invoiceUrl: updatedPayment.invoiceUrl,
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
        updatedAt: updatedPayment.updatedAt
      }
    };

    // Add confirmation message for successful payments
    if (paymentStatus === 'success') {
      responseData.confirmation = {
        message: `Payment of ₹${updatedPayment.amount} has been successfully processed!`,
        details: {
          paymentId: razorpayPaymentId,
          orderId: razorpayOrderId,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          isEarlyBird: updatedPayment.isEarlyBird,
          timestamp: new Date().toISOString()
        }
      };

      // Send payment confirmation email
      try {
        const user = await User.findById(updatedPayment.userId);
        if (user) {
          await sendPaymentConfirmationEmail(
            user.email,
            `${user.firstName} ${user.lastName}`,
            {
              amount: updatedPayment.amount,
              paymentId: razorpayPaymentId || 'N/A',
              orderId: razorpayOrderId,
              isEarlyBird: updatedPayment.isEarlyBird,
              timestamp: new Date().toISOString()
            }
          );
        }
      } catch (emailError) {
        // Email sending failed, but payment update should still succeed
      }
    }

    return NextResponse.json(responseData);

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
