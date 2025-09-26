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
    phoneNumber: string;
    isGoogleUser: boolean;
    isOTPVerified: boolean;
  };
}

const initialData: OnboardingFormData = {
  userId: '',
  userType: 'student',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  teamName: '',
  isTeamLeader: false,
  themeId: '',
  problemId: '',
  paymentAmount: 0,
  isEarlyBird: false,
  // Education object (role-based nested structure)
  education: {
    instituteName: '',
    branch: '',
    degree: '',
    graduationYear: '',
    yearOfStudy: '',
    city: '',
    state: '',
    pin: ''
  },
  // Job object (role-based nested structure)
  job: {
    jobTitle: '',
    company: '',
    yearOfExperience: '',
    city: '',
    state: '',
    pin: ''
  },
  // Legacy fields for backward compatibility
  profession: 'student',
  city: '',
  state: '',
  pin: ''
};

const steps = [
  { id: 'profession', title: 'Profession', description: 'Choose your profession' },
  { id: 'details', title: 'Details', description: 'Fill in your details' },
  { id: 'themes', title: 'Themes', description: 'Select hackathon themes' },
  { id: 'payment', title: 'Payment', description: 'Complete payment' }
];

export default function OnboardingClient({ user }: OnboardingClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    ...initialData,
    userId: user._id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    // Initialize education and job objects
    education: {
      instituteName: '',
      branch: '',
      degree: '',
      graduationYear: '',
      yearOfStudy: '',
      city: '',
      state: '',
      pin: ''
    },
    job: {
      jobTitle: '',
      company: '',
      yearOfExperience: '',
      city: '',
      state: '',
      pin: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Load existing user data from database
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/onboarding/save', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          const result = await response.json();
          const userData = result.data;
          
          
          // Update formData with existing user data - ROLE-BASED NESTED STRUCTURE
          setFormData(prev => ({
            ...prev,
            userType: userData.userType || prev.userType,
            profession: userData.profession || prev.profession,
            education: userData.education || prev.education,
            job: userData.job || prev.job,
            // Also populate legacy fields for backward compatibility
            city: userData.city || prev.city,
            state: userData.state || prev.state,
            pin: userData.pin || prev.pin
          }));
          
          setUserDataLoaded(true);
        } else {
          setUserDataLoaded(true); // Still set to true to avoid infinite loading
        }
      } catch (error) {
        setUserDataLoaded(true); // Still set to true to avoid infinite loading
      }
    };

    loadUserData();
  }, []);

  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    // Map profession to userType when profession is updated
    if (updates.profession) {
      const userType = updates.profession === 'working_professional' ? 'professional' : 'student';
      updates.userType = userType;
    }
    
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Handle deep merging for education object
      if (updates.education) {
        newData.education = {
          ...prev.education,
          ...updates.education
        };
      }
      
      // Handle deep merging for job object
      if (updates.job) {
        newData.job = {
          ...prev.job,
          ...updates.job
        };
      }
      
      // Sync legacy address fields with nested structure
      if (updates.city !== undefined || updates.state !== undefined || updates.pin !== undefined) {
        // If legacy fields are updated, sync them with the nested structure
        if (newData.userType === 'student' || newData.profession === 'student') {
          newData.education = {
            instituteName: newData.education?.instituteName || '',
            branch: newData.education?.branch || '',
            degree: newData.education?.degree || '',
            graduationYear: newData.education?.graduationYear || '',
            yearOfStudy: newData.education?.yearOfStudy || '',
            city: updates.city !== undefined ? updates.city : newData.education?.city || '',
            state: updates.state !== undefined ? updates.state : newData.education?.state || '',
            pin: updates.pin !== undefined ? updates.pin : newData.education?.pin || ''
          };
        } else if (newData.userType === 'professional' || newData.profession === 'working_professional') {
          newData.job = {
            jobTitle: newData.job?.jobTitle || '',
            company: newData.job?.company || '',
            yearOfExperience: newData.job?.yearOfExperience || '',
            city: updates.city !== undefined ? updates.city : newData.job?.city || '',
            state: updates.state !== undefined ? updates.state : newData.job?.state || '',
            pin: updates.pin !== undefined ? updates.pin : newData.job?.pin || ''
          };
        }
      }
      
      // Sync nested structure with legacy fields
      if (updates.education || updates.job) {
        if (newData.userType === 'student' || newData.profession === 'student') {
          const education = newData.education;
          if (education) {
            newData.city = education.city || newData.city || '';
            newData.state = education.state || newData.state || '';
            newData.pin = education.pin || newData.pin || '';
          }
        } else if (newData.userType === 'professional' || newData.profession === 'working_professional') {
          const job = newData.job;
          if (job) {
            newData.city = job.city || newData.city || '';
            newData.state = job.state || newData.state || '';
            newData.pin = job.pin || newData.pin || '';
          }
        }
      }
      
      
      return newData;
    });
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
        // Fetch payment details from database to get the actual payment IDs
        try {
          const paymentResponse = await fetch('/api/payments/latest', {
            method: 'GET',
            credentials: 'include'
          });
          
          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json();
            
            setPaymentDetails({
              paymentId: paymentData.payment?.razorpayPaymentId || formData.razorpayPaymentId || 'N/A',
              orderId: paymentData.payment?.razorpayOrderId || formData.razorpayOrderId || 'N/A',
              amount: paymentData.payment?.amount || formData.paymentAmount,
              isEarlyBird: paymentData.payment?.isEarlyBird || formData.isEarlyBird
            });
          } else {
            // Fallback to form data if API call fails
            setPaymentDetails({
              paymentId: formData.razorpayPaymentId || 'N/A',
              orderId: formData.razorpayOrderId || 'N/A',
              amount: formData.paymentAmount,
              isEarlyBird: formData.isEarlyBird
            });
          }
        } catch (paymentError) {
          // Fallback to form data if API call fails
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
            user={user}
          />
        ) : (
          <WorkingProfessionalForm
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            user={user}
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

  // Show loading state while user data is being loaded
  if (!userDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

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
