"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CreditCard, CheckCircle, Clock, Star, Sparkles } from 'lucide-react';
import { OnboardingFormData } from '@/types/onboarding';
import ClickSpark from '@/components/ClickSpark';

interface PaymentFormProps {
  data: OnboardingFormData;
  updateData: (updates: Partial<OnboardingFormData>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isLoading: boolean;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentForm({ data, updateData, onSubmit, onPrev, isLoading, user }: PaymentFormProps) {
  const [isEarlyBird, setIsEarlyBird] = useState(data.isEarlyBird);
  const [paymentAmount, setPaymentAmount] = useState(data.paymentAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [earlyBirdOfferEnabled, setEarlyBirdOfferEnabled] = useState(true);
  const [loadingOfferStatus, setLoadingOfferStatus] = useState(true);
  const [userData, setUserData] = useState(user);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const isEarlyBirdRef = useRef(isEarlyBird);

  // Update ref when isEarlyBird changes
  useEffect(() => {
    isEarlyBirdRef.current = isEarlyBird;
  }, [isEarlyBird]);

  // Calculate pricing based on profession
  const pricing = {
    student: {
      regular: 999,
      earlyBird: 499
    },
    working_professional: {
      regular: 1999,
      earlyBird: 999
    }
  };

  const currentPricing = pricing[data.profession || 'student'];
  const finalAmount = isEarlyBird ? currentPricing.earlyBird : currentPricing.regular;
  
  // Ensure we have a valid amount
  useEffect(() => {
    if (!finalAmount || finalAmount <= 0) {
      console.error('Invalid amount calculated:', finalAmount, 'Using fallback amount');
      const fallbackAmount = 999; // Default to student regular price
      setPaymentAmount(fallbackAmount);
      updateData({ paymentAmount: fallbackAmount });
    }
  }, [finalAmount]);
  

  // Load settings and user data
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings/registration-status');
        if (response.ok) {
          const data = await response.json();
          setEarlyBirdOfferEnabled(data.settings.earlyBirdEnabled);
          
          // If Early Bird is disabled and user had it selected, switch to regular
          if (!data.settings.earlyBirdEnabled && isEarlyBirdRef.current) {
            setIsEarlyBird(false);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoadingOfferStatus(false);
      }
    };

    // If user name is empty, try to fetch from database
    const loadUserData = async () => {
      if (!user.firstName && !user.lastName) {
        try {
          const response = await fetch('/api/sync-user');
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData.user);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadSettings();
    loadUserData();
  }, []);

  useEffect(() => {
    setPaymentAmount(finalAmount);
    updateData({ paymentAmount: finalAmount, isEarlyBird });
  }, [isEarlyBird, finalAmount]);

  const clearError = () => {
    setPaymentError(null);
  };

  const handlePaymentFailure = async (orderId: string, errorReason?: string, errorCode?: string) => {
    try {
      const response = await fetch('/api/payment/failed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          error_reason: errorReason,
          error_code: errorCode
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to record payment failure:', data.error);
      }
    } catch (error) {
      console.error('Error recording payment failure:', error);
    }
  };

  const handleEarlyBirdToggle = (checked: boolean) => {
    // Don't allow toggling if Early Bird offer is disabled
    if (!earlyBirdOfferEnabled) {
      return;
    }

    // Clear any existing errors when user makes changes
    clearError();

    if (checked) {
      setIsAnimating(true);
      
      // Trigger amount decrease animation
      setTimeout(() => {
        setIsEarlyBird(true);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsEarlyBird(false);
    }
  };

  const loadRazorpayScript = (retryCount = 0) => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        if (retryCount < 2) {
          setTimeout(() => {
            loadRazorpayScript(retryCount + 1).then(resolve);
          }, 1000);
        } else {
          resolve(false);
        }
      };
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount: number) => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `hackathon_${Date.now()}`,
          isEarlyBird: isEarlyBird, // Include isEarlyBird field
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data.order; // Return the order object, not the entire response
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    clearError(); // Clear any previous errors
    setCurrentOrderId(null); // Clear previous order ID
    
    try {
      // Validate amount before proceeding
      if (!finalAmount || finalAmount <= 0) {
        throw new Error('Invalid payment amount. Please refresh the page and try again.');
      }

      // Validate Razorpay key
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error('Razorpay configuration error. Please contact support.');
      }

      // Validate user data
      if (!userData?.email) {
        throw new Error('User information incomplete. Please refresh the page and try again.');
      }
      
      // For Google Auth users, phoneNumber might be empty initially
      // We'll use the phone number from form data if available
      const phoneNumber = userData?.phoneNumber || data.phoneNumber;
      if (!phoneNumber) {
        throw new Error('Phone number is required. Please go back and complete your profile.');
      }
      
      // Update userData with form data if it's more complete
      if (data.firstName && data.lastName && data.phoneNumber) {
        setUserData(prev => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          phoneNumber: data.phoneNumber || prev.phoneNumber
        }));
      }
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script. Please check your internet connection and try again.');
      }

      // Create order
      const orderData = await createRazorpayOrder(finalAmount);
      
      // Store order ID for failure handling
      setCurrentOrderId(orderData.id);


      // Validate minimum amount (Razorpay requires minimum 1 INR = 100 paise)
      if (finalAmount < 1) {
        throw new Error('Payment amount must be at least ₹1');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseInt(orderData.amount.toString()), // Ensure it's a proper integer
        currency: orderData.currency,
        name: 'Novothon',
        description: `Registration Fee - ${data.profession === 'student' ? 'Student' : 'Working Professional'} (${isEarlyBird ? 'Early Bird Offer' : 'Regular'})`,
        order_id: orderData.id,
        // image: '/favicon.svg', // Removed to avoid mixed content issues
        theme: {
          color: '#4F46E5',
          backdrop_color: '#000000',
        },
        handler: async function (response: any) {
          try {
            
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: finalAmount,
                isEarlyBird,
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyResponse.ok) {
              
              // Update form data with payment details
              updateData({
                paymentStatus: 'completed',
                paymentAmount: finalAmount,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              
              // Stop the processing loader
              setIsProcessing(false);
              
              // Wait a moment to ensure the update is processed
              setTimeout(() => {
                // Submit the form
                onSubmit();
              }, 100);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Please try again.';
            alert(`Payment verification failed: ${errorMessage}`);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'User',
          email: userData?.email || '',
          contact: phoneNumber, // Use the resolved phone number
        },
        notes: {
          address: (() => {
            // Get address based on user type - ROLE-BASED NESTED STRUCTURE
            let city = '', state = '', pin = '';
            if (data.userType === 'student' || data.profession === 'student') {
              city = data.education?.city || data.city || '';
              state = data.education?.state || data.state || '';
              pin = data.education?.pin || data.pin || '';
            } else {
              city = data.job?.city || data.city || '';
              state = data.job?.state || data.state || '';
              pin = data.job?.pin || data.pin || '';
            }
            
            
            return `${userData?.firstName || ''} ${userData?.lastName || ''}, ${city}, ${state} - ${pin}`;
          })(),
          user_id: userData?._id || '',
          profession: data.userType || data.profession || 'student',
          registration_type: isEarlyBird ? 'early_bird' : 'regular',
          amount_paid: finalAmount,
          email: userData?.email || '',
          full_name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim(),
          phone: phoneNumber,
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        callback_url: `${window.location.origin}/onboarding`,
        timeout: 900, // 15 minutes
        readonly: {
          email: true, // Make email read-only since we're providing it
          contact: true, // Make contact read-only since we're providing it
        },
        hidden: {
          contact: false, // Show contact field with user's phone number
        }
      };

      const rzp = new window.Razorpay(options);
      
      // Add error handler for Razorpay modal
      rzp.on('payment.failed', function (response: any) {
        const errorMessage = response.error?.description || 'Payment failed. Please try again.';
        setPaymentError(errorMessage);
        setIsProcessing(false);
        setRetryCount(prev => prev + 1);
        
        // Record payment failure in database
        if (currentOrderId) {
          handlePaymentFailure(
            currentOrderId, 
            response.error?.description || 'Payment failed',
            response.error?.code || 'PAYMENT_FAILED'
          );
        }
      });

      // Add error handler for modal errors
      rzp.on('modal.error', function (response: any) {
        setPaymentError('Payment modal error. Please try again.');
        setIsProcessing(false);
        setRetryCount(prev => prev + 1);
        
        // Record payment failure in database
        if (currentOrderId) {
          handlePaymentFailure(
            currentOrderId, 
            'Payment modal error',
            'MODAL_ERROR'
          );
        }
      });

      try {
        rzp.open();
      } catch (error) {
        setPaymentError('Failed to open payment modal. Please try again.');
        setIsProcessing(false);
        setRetryCount(prev => prev + 1);
        
        // Record payment failure in database
        if (currentOrderId) {
          handlePaymentFailure(
            currentOrderId, 
            'Failed to open payment modal',
            'MODAL_OPEN_ERROR'
          );
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      setPaymentError(errorMessage);
      setIsProcessing(false);
      setRetryCount(prev => prev + 1);
      
      // Record payment failure in database
      if (currentOrderId) {
        handlePaymentFailure(
          currentOrderId, 
          errorMessage,
          'PAYMENT_INIT_ERROR'
        );
      }
    }
  };


  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Complete Your Registration
        </h2>
        <p className="text-gray-600 text-sm">
          Choose your plan and complete the payment to join the hackathon
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Regular Plan */}
        <Card className={`transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
          !isEarlyBird ? 'border-2 border-blue-500 shadow-lg bg-blue-50' : 'border border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => setIsEarlyBird(false)}>
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <div className="h-6 mb-2"></div>
              <CardTitle className="text-lg text-gray-900 mb-1">Regular Plan</CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                ₹{currentPricing.regular}
              </div>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                All hackathon themes
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                Problem statements
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                Community access
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                Certificate
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Early Bird Plan */}
        {earlyBirdOfferEnabled ? (
          <ClickSpark
            sparkColor='#f97316'
            sparkSize={6}
            sparkRadius={25}
            sparkCount={16}
            duration={800}
            easing='ease-out'
            extraScale={1.3}
          >
            <Card className={`transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer relative overflow-hidden ${
              isEarlyBird ? 'border-2 border-orange-500 shadow-lg bg-orange-50' : 'border border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => handleEarlyBirdToggle(true)}>
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center mb-2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold animate-pulse px-3 py-1 rounded-full shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      LIMITED TIME OFFER
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-900 mb-1">Novothon Early Bird</CardTitle>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="text-3xl font-bold text-gray-900">
                      ₹{currentPricing.earlyBird}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₹{currentPricing.regular}
                    </div>
                  </div>
                  <div className="text-xs text-orange-600 font-medium">
                    Save ₹{currentPricing.regular - currentPricing.earlyBird}!
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    Everything in Regular
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    Early access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    Bonus swag
                  </li>
                </ul>
              </CardContent>
            </Card>
          </ClickSpark>
        ) : (
          <Card className="relative overflow-hidden opacity-60 cursor-not-allowed border border-gray-300 bg-gray-100">
            <CardContent className="p-4">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-2">
                  <Badge className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    EXPIRED
                  </Badge>
                </div>
                <CardTitle className="text-lg text-gray-500 mb-1">Novothon Early Bird</CardTitle>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="text-3xl font-bold text-gray-400">
                    ₹{currentPricing.earlyBird}
                  </div>
                  <div className="text-sm text-gray-400 line-through">
                    ₹{currentPricing.regular}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Offer has ended
                </div>
              </div>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-gray-400 mr-2" />
                  Everything in Regular
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-gray-400 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-gray-400 mr-2" />
                  Early access
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-gray-400 mr-2" />
                  Bonus swag
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>


      {/* Payment Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-bold text-gray-900 mb-3 text-base flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
            Payment Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Registration Fee:</span>
              <span className="font-semibold text-base text-gray-900">
                ₹{currentPricing.regular}
              </span>
            </div>
            {isEarlyBird && earlyBirdOfferEnabled && (
              <div className="flex justify-between items-center py-1 bg-green-50 rounded px-2">
                <span className="text-green-700 font-medium text-xs">Early Bird Discount:</span>
                <span className="text-green-600 font-bold text-xs">
                  -₹{currentPricing.regular - currentPricing.earlyBird}
                </span>
              </div>
            )}
            <div className="border-t border-blue-200 pt-2 flex justify-between items-center">
              <span className="font-bold text-base text-gray-900">Total Amount:</span>
              <span className={`font-bold text-xl text-blue-600 transition-all duration-500 ${
                isAnimating ? 'scale-110' : ''
              }`}>
                ₹{finalAmount}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <div className="font-medium">{userData?.firstName} {userData?.lastName}</div>
              <div>{userData?.email}</div>
              <div>{(() => {
                // Get address based on user type - ROLE-BASED NESTED STRUCTURE
                let city = '', state = '', pin = '';
                if (data.userType === 'student' || data.profession === 'student') {
                  city = data.education?.city || data.city || '';
                  state = data.education?.state || data.state || '';
                  pin = data.education?.pin || data.pin || '';
                } else {
                  city = data.job?.city || data.city || '';
                  state = data.job?.state || data.state || '';
                  pin = data.job?.pin || data.pin || '';
                }
                
                
                return `${city}, ${state} - ${pin}`;
              })()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Error Display */}
      {paymentError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Payment Failed
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  {paymentError}
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={clearError}
                    variant="outline"
                    size="sm"
                    className="text-red-700 border-red-300 hover:bg-red-100"
                  >
                    Dismiss
                  </Button>
                  {retryCount < 3 && (
                    <Button
                      onClick={handlePayment}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again ({3 - retryCount} attempts left)
                    </Button>
                  )}
                </div>
                {retryCount >= 3 && (
                  <p className="text-xs text-red-600 mt-2">
                    Maximum retry attempts reached. Please contact support if the issue persists.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex items-center px-6 py-3 text-base font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md transition-all duration-200 text-gray-700 hover:text-gray-900"
          disabled={isProcessing || isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handlePayment}
          disabled={isProcessing || isLoading || retryCount >= 3}
          className={`flex items-center font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            retryCount >= 3 
              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing Payment...
            </>
          ) : retryCount >= 3 ? (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Max Retries Reached
            </>
          ) : retryCount > 0 ? (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Retry Payment - ₹{finalAmount}
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment - ₹{finalAmount}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
