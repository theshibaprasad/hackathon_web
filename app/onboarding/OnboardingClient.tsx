"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import PaymentSuccessModal from '@/components/onboarding/PaymentSuccessModal';

// Import form components
import ProfessionSelection from '@/components/onboarding/ProfessionSelection';
import StudentForm from '@/components/onboarding/StudentForm';
import WorkingProfessionalForm from '@/components/onboarding/WorkingProfessionalForm';
import ThemeSelection from '@/components/onboarding/ThemeSelection';
import PaymentForm from '@/components/onboarding/PaymentForm';
import { OnboardingFormData } from '@/types/onboarding';

interface OnboardingClientProps {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const initialData: OnboardingFormData = {
  userId: '',
  profession: 'student',
  gender: '',
  city: '',
  state: '',
  pin: '',
  instituteName: '',
  degree: '',
  branch: '',
  yearOfStudy: '',
  graduationYear: '',
  companyName: '',
  jobTitle: '',
  yearsOfExperience: '',
  teamName: '',
  isTeamLeader: false,
  selectedThemes: [],
  selectedProblemStatements: [],
  paymentStatus: 'pending',
  paymentAmount: 0,
  isEarlyBird: false
};

const steps = [
  { id: 'profession', title: 'Profession', description: 'Choose your profession' },
  { id: 'details', title: 'Details', description: 'Fill in your details' },
  { id: 'themes', title: 'Themes', description: 'Select hackathon themes' },
  { id: 'payment', title: 'Payment', description: 'Complete payment' }
];

export default function OnboardingClient({ user }: OnboardingClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleClosePaymentSuccess = () => {
    setShowPaymentSuccess(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Fetch the latest user data from database to get updated payment details
        const userResponse = await fetch('/api/onboarding/save', {
          method: 'GET',
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const user = userData.data;
          
          // Set payment details for the success modal from database
          setPaymentDetails({
            paymentId: user.razorpayPaymentId || 'N/A',
            orderId: user.razorpayOrderId || 'N/A',
            amount: user.paymentAmount || formData.paymentAmount,
            isEarlyBird: user.isEarlyBird || formData.isEarlyBird
          });
        } else {
          // Fallback to form data if database fetch fails
          setPaymentDetails({
            paymentId: formData.razorpayPaymentId || 'N/A',
            orderId: formData.razorpayOrderId || 'N/A',
            amount: formData.paymentAmount,
            isEarlyBird: formData.isEarlyBird
          });
        }
        
        // Show payment success modal
        setShowPaymentSuccess(true);
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to save onboarding data',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfessionSelection
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 1:
        return formData.profession === 'student' ? (
          <StudentForm
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        ) : (
          <WorkingProfessionalForm
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <ThemeSelection
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <PaymentForm
            data={formData}
            updateData={updateFormData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isLoading={isLoading}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-gray-600">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <AnimatePresence mode="wait">
                {renderCurrentStep()}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment Success Modal */}
      {paymentDetails && (
        <PaymentSuccessModal
          isOpen={showPaymentSuccess}
          formData={formData}
          user={user}
          paymentDetails={paymentDetails}
          onClose={handleClosePaymentSuccess}
        />
      )}
    </div>
  );
}
