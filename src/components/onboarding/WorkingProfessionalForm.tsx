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
}

export default function WorkingProfessionalForm({ data, updateData, onNext, onPrev }: WorkingProfessionalFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.gender) newErrors.gender = 'Please select your gender';
    if (!data.city.trim()) newErrors.city = 'City is required';
    if (!data.state.trim()) newErrors.state = 'State is required';
    if (!data.pin.trim()) newErrors.pin = 'PIN is required';
    if (!/^\d{6}$/.test(data.pin)) newErrors.pin = 'PIN must be 6 digits';
    if (!data.companyName?.trim()) newErrors.companyName = 'Company name is required';
    if (!data.jobTitle?.trim()) newErrors.jobTitle = 'Job title is required';
    if (!data.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof OnboardingFormData, value: string) => {
    updateData({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
              value={data.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter your company name"
              className={`h-11 ${errors.companyName ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title *</Label>
            <Input
              id="jobTitle"
              value={data.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager, etc."
              className={`h-11 ${errors.jobTitle ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience" className="text-sm font-medium">Years of Experience *</Label>
            <Select value={data.yearsOfExperience} onValueChange={(value) => handleInputChange('yearsOfExperience', value)}>
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

          {/* Company Location */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">Company City *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter company city"
              className={`h-11 ${errors.city ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">Company State *</Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Enter company state"
              className={`h-11 ${errors.state ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin" className="text-sm font-medium">Company PIN Code *</Label>
            <Input
              id="pin"
              value={data.pin}
              onChange={(e) => handleInputChange('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
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
