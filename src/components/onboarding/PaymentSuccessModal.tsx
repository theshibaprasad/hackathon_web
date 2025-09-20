"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, ArrowRight, CreditCard, Calendar, MapPin, User } from 'lucide-react';
import { OnboardingFormData } from '@/types/onboarding';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  formData: OnboardingFormData;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  paymentDetails: {
    paymentId: string;
    orderId: string;
    amount: number;
    isEarlyBird: boolean;
  };
  onClose: () => void;
}

export default function PaymentSuccessModal({ 
  isOpen, 
  formData, 
  user, 
  paymentDetails, 
  onClose 
}: PaymentSuccessModalProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      // Create invoice data
      const invoiceData = {
        invoiceNumber: `INV-${paymentDetails.orderId.slice(-8).toUpperCase()}`,
        date: new Date().toLocaleDateString('en-IN'),
        customer: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber,
          address: `${formData.city}, ${formData.state} - ${formData.pin}`
        },
        items: [{
          description: `Hackathon Registration - ${formData.profession === 'student' ? 'Student' : 'Working Professional'}${paymentDetails.isEarlyBird ? ' (Early Bird)' : ''}`,
          amount: paymentDetails.amount
        }],
        total: paymentDetails.amount,
        paymentId: paymentDetails.paymentId,
        orderId: paymentDetails.orderId
      };

      // Generate PDF content (simplified version)
      const invoiceContent = `
        INVOICE
        Invoice Number: ${invoiceData.invoiceNumber}
        Date: ${invoiceData.date}
        
        Bill To:
        ${invoiceData.customer.name}
        ${invoiceData.customer.email}
        ${invoiceData.customer.phone}
        ${invoiceData.customer.address}
        
        Items:
        ${invoiceData.items[0].description} - ₹${invoiceData.items[0].amount}
        
        Total Amount: ₹${invoiceData.total}
        
        Payment ID: ${invoiceData.paymentId}
        Order ID: ${invoiceData.orderId}
      `;

      // Create and download file
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceData.invoiceNumber}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-2xl mx-4"
        >
          <Card className="border-0 shadow-2xl bg-white">
            <CardContent className="p-0">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-2"
                  >
                    Payment Successful!
                  </motion.h2>
                  
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-green-100 text-lg"
                  >
                    Welcome to Novothon! Your registration is complete.
                  </motion.p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                      Payment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-semibold text-green-600">₹{paymentDetails.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-xs">{paymentDetails.paymentId.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono text-xs">{paymentDetails.orderId.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="text-gray-900">
                          {formData.profession === 'student' ? 'Student' : 'Working Professional'}
                          {paymentDetails.isEarlyBird && ' (Early Bird)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registration Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Registration Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold">{user.firstName} {user.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team:</span>
                        <span className="font-semibold text-blue-600">{formData.teamName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900">{formData.city}, {formData.state}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleDownloadInvoice}
                    disabled={isDownloading}
                    variant="outline"
                    className="flex-1 h-12 text-base font-medium border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                        Generating Invoice...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Download Invoice
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleGoToDashboard}
                    className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>Next Steps:</strong> You can now add team members, view hackathon details, and access all features from your dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
