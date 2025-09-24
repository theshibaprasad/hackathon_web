"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { OnboardingFormData } from '@/types/onboarding';

interface WorkingProfessionalFormProps {
  data: OnboardingFormData;
  updateData: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  user?: {
    isGoogleUser: boolean;
    isOTPVerified: boolean;
  };
}

export default function WorkingProfessionalForm({ data, updateData, onNext, onPrev, user }: WorkingProfessionalFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to create complete job object
  const createJobObject = (updates: Partial<{ jobTitle: string; company: string; yearOfExperience: string; city: string; state: string; pin: string }>) => {
    return {
      jobTitle: updates.jobTitle !== undefined ? updates.jobTitle : (data.job?.jobTitle || ''),
      company: updates.company !== undefined ? updates.company : (data.job?.company || ''),
      yearOfExperience: updates.yearOfExperience !== undefined ? updates.yearOfExperience : (data.job?.yearOfExperience || ''),
      city: updates.city !== undefined ? updates.city : (data.job?.city || ''),
      state: updates.state !== undefined ? updates.state : (data.job?.state || ''),
      pin: updates.pin !== undefined ? updates.pin : (data.job?.pin || '')
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic information validation (for Google users or when basic info is missing)
    if (user?.isGoogleUser || !data.firstName || !data.lastName || !data.phoneNumber) {
      if (!data.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!data.lastName?.trim()) newErrors.lastName = 'Last name is required';
      if (!data.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    }
    
    // Phone number validation (same as register page)
    if (data.phoneNumber?.trim()) {
      let phoneNumber = data.phoneNumber;
      
      // If it's just 10 digits, add +91
      if (/^\d{10}$/.test(phoneNumber)) {
        phoneNumber = '+91' + phoneNumber;
      }
      // If it starts with 91 and has 10 more digits, add +
      else if (/^91\d{10}$/.test(phoneNumber)) {
        phoneNumber = '+' + phoneNumber;
      }
      // If it starts with 0 and has 10 digits, remove 0 and add +91
      else if (/^0\d{9}$/.test(phoneNumber)) {
        phoneNumber = '+91' + phoneNumber.slice(1);
      }
      
      const phoneRegex = /^\+91[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid Indian phone number';
      }
    }

    // Personal details validation
    if (!data.gender) newErrors.gender = 'Please select your gender';
    
    // Company address validation - ROLE-BASED NESTED STRUCTURE
    const companyCity = data.job?.city || data.city;
    const companyState = data.job?.state || data.state;
    const companyPin = data.job?.pin || data.pin;
    
    if (!companyCity?.trim()) newErrors.city = 'Company city is required';
    if (!companyState?.trim()) newErrors.state = 'Company state is required';
    if (!companyPin?.trim()) newErrors.pin = 'Company PIN code is required';
    if (companyPin && !/^\d{6}$/.test(companyPin)) newErrors.pin = 'PIN must be 6 digits';
    
    // Professional details validation - ROLE-BASED NESTED STRUCTURE
    if (!data.job?.company?.trim()) newErrors.companyName = 'Company name is required';
    if (!data.job?.jobTitle?.trim()) newErrors.jobTitle = 'Job title is required';
    if (!data.job?.yearOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Format phone number before proceeding
      if (data.phoneNumber?.trim()) {
        let phoneNumber = data.phoneNumber;
        
        // If it's just 10 digits, add +91
        if (/^\d{10}$/.test(phoneNumber)) {
          phoneNumber = '+91' + phoneNumber;
        }
        // If it starts with 91 and has 10 more digits, add +
        else if (/^91\d{10}$/.test(phoneNumber)) {
          phoneNumber = '+' + phoneNumber;
        }
        // If it starts with 0 and has 10 digits, remove 0 and add +91
        else if (/^0\d{9}$/.test(phoneNumber)) {
          phoneNumber = '+91' + phoneNumber.slice(1);
        }
        
        // Update the data with formatted phone number
        updateData({ phoneNumber });
      }
      onNext();
    }
  };

  const handleInputChange = (field: keyof OnboardingFormData, value: string) => {
    updateData({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Handle different input formats (same as register page)
    if (digits.length <= 10) {
      // If user enters just digits (up to 10), keep as is
      updateData({ phoneNumber: digits });
    } else if (digits.length === 11 && digits.startsWith('91')) {
      // If user enters 91 followed by 10 digits, format as +91
      updateData({ phoneNumber: '+91' + digits.slice(2) });
    } else if (digits.length === 12 && digits.startsWith('91')) {
      // If user enters 91 followed by 10 digits with extra, format as +91
      updateData({ phoneNumber: '+91' + digits.slice(2, 12) });
    } else if (digits.length > 10) {
      // If more than 10 digits, take only the last 10
      updateData({ phoneNumber: digits.slice(-10) });
    } else {
      updateData({ phoneNumber: digits });
    }
    
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  const experienceRanges = [
    '0-1 years',
    '1-2 years',
    '2-3 years',
    '3-5 years',
    '5-7 years',
    '7-10 years',
    '10+ years'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Professional Information
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Tell us about your professional background and personal details
        </p>
      </div>

      {/* Basic Information - Show for Google users or when basic info is missing */}
      {(user?.isGoogleUser || !data.firstName || !data.lastName || !data.phoneNumber) && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">👤</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Basic Information
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                className={`h-11 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                className={`h-11 ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={data.phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+91 0123456789"
                className={`h-11 ${errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">👤</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gender Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Gender *</Label>
            <RadioGroup
              value={data.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
                <Label htmlFor="prefer_not_to_say">Prefer not to say</Label>
              </div>
            </RadioGroup>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">🏢</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Company Details
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
            <Input
              id="companyName"
              value={data.job?.company || ''}
              onChange={(e) => {
                const value = e.target.value;
                updateData({
                  job: createJobObject({ company: value }),
                  companyName: value // Keep legacy field for backward compatibility
                });
                if (errors.companyName) {
                  setErrors(prev => ({ ...prev, companyName: '' }));
                }
              }}
              placeholder="Enter your company name"
              className={`h-11 ${errors.companyName ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title *</Label>
            <Input
              id="jobTitle"
              value={data.job?.jobTitle || ''}
              onChange={(e) => {
                const value = e.target.value;
                updateData({
                  job: createJobObject({ jobTitle: value }),
                  jobTitle: value // Keep legacy field for backward compatibility
                });
                if (errors.jobTitle) {
                  setErrors(prev => ({ ...prev, jobTitle: '' }));
                }
              }}
              placeholder="e.g., Software Engineer, Product Manager, etc."
              className={`h-11 ${errors.jobTitle ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience" className="text-sm font-medium">Years of Experience *</Label>
            <Select 
              value={data.job?.yearOfExperience || ''} 
              onValueChange={(value) => {
                updateData({
                  job: createJobObject({ yearOfExperience: value }),
                  yearsOfExperience: value // Keep legacy field for backward compatibility
                });
                if (errors.yearsOfExperience) {
                  setErrors(prev => ({ ...prev, yearsOfExperience: '' }));
                }
              }}
            >
              <SelectTrigger className={errors.yearsOfExperience ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your experience" />
              </SelectTrigger>
              <SelectContent>
                {experienceRanges.map((range) => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.yearsOfExperience && <p className="text-sm text-red-500">{errors.yearsOfExperience}</p>}
          </div>

          {/* Company Address */}
          <div className="space-y-2">
            <Label htmlFor="companyCity" className="text-sm font-medium">Company City *</Label>
            <Input
              id="companyCity"
              value={data.job?.city || data.city || ''}
              onChange={(e) => {
                const value = e.target.value;
                updateData({ 
                  job: createJobObject({ city: value }),
                  city: value // Keep legacy field for backward compatibility
                });
                if (errors.city) {
                  setErrors(prev => ({ ...prev, city: '' }));
                }
              }}
              placeholder="Enter company city"
              className={`h-11 ${errors.city ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyState" className="text-sm font-medium">Company State *</Label>
            <Input
              id="companyState"
              value={data.job?.state || data.state || ''}
              onChange={(e) => {
                const value = e.target.value;
                updateData({ 
                  job: createJobObject({ state: value }),
                  state: value // Keep legacy field for backward compatibility
                });
                if (errors.state) {
                  setErrors(prev => ({ ...prev, state: '' }));
                }
              }}
              placeholder="Enter company state"
              className={`h-11 ${errors.state ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPin" className="text-sm font-medium">Company PIN Code *</Label>
            <Input
              id="companyPin"
              value={data.job?.pin || data.pin || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                updateData({ 
                  job: createJobObject({ pin: value }),
                  pin: value // Keep legacy field for backward compatibility
                });
                if (errors.pin) {
                  setErrors(prev => ({ ...prev, pin: '' }));
                }
              }}
              placeholder="Enter 6-digit PIN"
              maxLength={6}
              className={`h-11 ${errors.pin ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.pin && <p className="text-sm text-red-500">{errors.pin}</p>}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex items-center px-6 py-3 text-base font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md transition-all duration-200 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          className="flex items-center px-6 py-3 text-base font-medium bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
