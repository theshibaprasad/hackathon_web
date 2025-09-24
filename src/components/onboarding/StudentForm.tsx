"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { OnboardingFormData } from '@/types/onboarding';

interface StudentFormProps {
  data: OnboardingFormData;
  updateData: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  user?: {
    isGoogleUser: boolean;
    isOTPVerified: boolean;
  };
}

export default function StudentForm({ data, updateData, onNext, onPrev, user }: StudentFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to create complete education object
  const createEducationObject = (updates: Partial<{ instituteName: string; branch: string; degree: string; graduationYear: string; yearOfStudy: string; city: string; state: string; pin: string }>) => {
    return {
      instituteName: updates.instituteName !== undefined ? updates.instituteName : (data.education?.instituteName || ''),
      branch: updates.branch !== undefined ? updates.branch : (data.education?.branch || ''),
      degree: updates.degree !== undefined ? updates.degree : (data.education?.degree || ''),
      graduationYear: updates.graduationYear !== undefined ? updates.graduationYear : (data.education?.graduationYear || ''),
      yearOfStudy: updates.yearOfStudy !== undefined ? updates.yearOfStudy : (data.education?.yearOfStudy || ''),
      city: updates.city !== undefined ? updates.city : (data.education?.city || ''),
      state: updates.state !== undefined ? updates.state : (data.education?.state || ''),
      pin: updates.pin !== undefined ? updates.pin : (data.education?.pin || '')
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
    
    // Institute address validation - ROLE-BASED NESTED STRUCTURE
    const instituteCity = data.education?.city || data.city;
    const instituteState = data.education?.state || data.state;
    const institutePin = data.education?.pin || data.pin;
    
    if (!instituteCity?.trim()) newErrors.city = 'Institute city is required';
    if (!instituteState?.trim()) newErrors.state = 'Institute state is required';
    if (!institutePin?.trim()) newErrors.pin = 'Institute PIN code is required';
    if (institutePin && !/^\d{6}$/.test(institutePin)) newErrors.pin = 'PIN must be 6 digits';
    
    // Education details validation - ROLE-BASED NESTED STRUCTURE
    if (!data.education?.instituteName?.trim()) newErrors.instituteName = 'Institute name is required';
    if (!data.education?.degree?.trim()) newErrors.degree = 'Degree is required';
    if (!data.education?.branch?.trim()) newErrors.branch = 'Branch is required';
    if (!data.education?.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
    if (!data.education?.graduationYear) newErrors.graduationYear = 'Graduation year is required';

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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Final Year'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Student Information
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Tell us about your educational background and personal details
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

      {/* Institute Details */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Institute Details
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instituteName" className="text-sm font-medium">Institute Name *</Label>
            <Input
              id="instituteName"
              value={data.education?.instituteName || ''}
              onChange={(e) => {
                const value = e.target.value;
                updateData({
                  education: createEducationObject({ instituteName: value }),
                  instituteName: value // Keep legacy field for backward compatibility
                });
                if (errors.instituteName) {
                  setErrors(prev => ({ ...prev, instituteName: '' }));
                }
              }}
              placeholder="Enter your institute name"
              className={`h-11 ${errors.instituteName ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.instituteName && <p className="text-sm text-red-500">{errors.instituteName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree" className="text-sm font-medium">Degree *</Label>
            <Select 
              value={data.education?.degree || ''} 
              onValueChange={(value) => {
                updateData({
                  education: createEducationObject({ degree: value }),
                  degree: value // Keep legacy field for backward compatibility
                });
                if (errors.degree) {
                  setErrors(prev => ({ ...prev, degree: '' }));
                }
              }}
            >
              <SelectTrigger className={errors.degree ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="B.E">B.E</SelectItem>
                <SelectItem value="B.Sc">B.Sc</SelectItem>
                <SelectItem value="B.Com">B.Com</SelectItem>
                <SelectItem value="B.A">B.A</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
                <SelectItem value="M.E">M.E</SelectItem>
                <SelectItem value="M.Sc">M.Sc</SelectItem>
                <SelectItem value="M.Com">M.Com</SelectItem>
                <SelectItem value="M.A">M.A</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
                <SelectItem value="MCA">MCA</SelectItem>
                <SelectItem value="BCA">BCA</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.degree && <p className="text-sm text-red-500">{errors.degree}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch" className="text-sm font-medium">Branch/Stream *</Label>
            <Input
              id="branch"
              value={data.education?.branch || ''}
              onChange={(e) => {
                const value = e.target.value;
                updateData({
                  education: createEducationObject({ branch: value }),
                  branch: value // Keep legacy field for backward compatibility
                });
                if (errors.branch) {
                  setErrors(prev => ({ ...prev, branch: '' }));
                }
              }}
              placeholder="e.g., Computer Science, Electronics, etc."
              className={errors.branch ? 'border-red-500' : ''}
            />
            {errors.branch && <p className="text-sm text-red-500">{errors.branch}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearOfStudy" className="text-sm font-medium">Year of Study *</Label>
            <Select 
              value={data.education?.yearOfStudy || ''} 
              onValueChange={(value) => {
                updateData({
                  education: createEducationObject({ yearOfStudy: value }),
                  yearOfStudy: value // Keep legacy field for backward compatibility
                });
                if (errors.yearOfStudy) {
                  setErrors(prev => ({ ...prev, yearOfStudy: '' }));
                }
              }}
            >
              <SelectTrigger className={errors.yearOfStudy ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your year" />
              </SelectTrigger>
              <SelectContent>
                {studyYears.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.yearOfStudy && <p className="text-sm text-red-500">{errors.yearOfStudy}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="graduationYear" className="text-sm font-medium">Expected Graduation Year *</Label>
            <Select 
              value={data.education?.graduationYear?.toString() || ''} 
              onValueChange={(value) => {
                updateData({
                  education: createEducationObject({ graduationYear: value }),
                  graduationYear: value // Keep legacy field for backward compatibility
                });
                if (errors.graduationYear) {
                  setErrors(prev => ({ ...prev, graduationYear: '' }));
                }
              }}
            >
              <SelectTrigger className={errors.graduationYear ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select graduation year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.graduationYear && <p className="text-sm text-red-500">{errors.graduationYear}</p>}
          </div>

          {/* Institute Address */}
          <div className="space-y-2">
            <Label htmlFor="instituteCity" className="text-sm font-medium">Institute City *</Label>
            <Input
              id="instituteCity"
              value={data.education?.city || data.city || ''}
              onChange={(e) => {
                const value = e.target.value;
                updateData({ 
                  education: createEducationObject({ city: value }),
                  city: value // Keep legacy field for backward compatibility
                });
                if (errors.city) {
                  setErrors(prev => ({ ...prev, city: '' }));
                }
              }}
              placeholder="Enter institute city"
              className={`h-11 ${errors.city ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instituteState" className="text-sm font-medium">Institute State *</Label>
            <Input
              id="instituteState"
              value={data.education?.state || data.state || ''}
              onChange={(e) => {
                const value = e.target.value;
                updateData({ 
                  education: createEducationObject({ state: value }),
                  state: value // Keep legacy field for backward compatibility
                });
                if (errors.state) {
                  setErrors(prev => ({ ...prev, state: '' }));
                }
              }}
              placeholder="Enter institute state"
              className={`h-11 ${errors.state ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="institutePin" className="text-sm font-medium">Institute PIN Code *</Label>
            <Input
              id="institutePin"
              value={data.education?.pin || data.pin || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                updateData({ 
                  education: createEducationObject({ pin: value }),
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
