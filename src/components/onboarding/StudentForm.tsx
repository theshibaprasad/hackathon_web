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
}

export default function StudentForm({ data, updateData, onNext, onPrev }: StudentFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.gender) newErrors.gender = 'Please select your gender';
    if (!data.city.trim()) newErrors.city = 'City is required';
    if (!data.state.trim()) newErrors.state = 'State is required';
    if (!data.pin.trim()) newErrors.pin = 'PIN is required';
    if (!/^\d{6}$/.test(data.pin)) newErrors.pin = 'PIN must be 6 digits';
    if (!data.instituteName?.trim()) newErrors.instituteName = 'Institute name is required';
    if (!data.degree?.trim()) newErrors.degree = 'Degree is required';
    if (!data.branch?.trim()) newErrors.branch = 'Branch is required';
    if (!data.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
    if (!data.graduationYear?.trim()) newErrors.graduationYear = 'Graduation year is required';

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
              value={data.instituteName}
              onChange={(e) => handleInputChange('instituteName', e.target.value)}
              placeholder="Enter your institute name"
              className={`h-11 ${errors.instituteName ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.instituteName && <p className="text-sm text-red-500">{errors.instituteName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree" className="text-sm font-medium">Degree *</Label>
            <Select value={data.degree} onValueChange={(value) => handleInputChange('degree', value)}>
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
              value={data.branch}
              onChange={(e) => handleInputChange('branch', e.target.value)}
              placeholder="e.g., Computer Science, Electronics, etc."
              className={errors.branch ? 'border-red-500' : ''}
            />
            {errors.branch && <p className="text-sm text-red-500">{errors.branch}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearOfStudy" className="text-sm font-medium">Year of Study *</Label>
            <Select value={data.yearOfStudy} onValueChange={(value) => handleInputChange('yearOfStudy', value)}>
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
            <Select value={data.graduationYear} onValueChange={(value) => handleInputChange('graduationYear', value)}>
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

          {/* Institute Location */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">Institute City *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter institute city"
              className={`h-11 ${errors.city ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">Institute State *</Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Enter institute state"
              className={`h-11 ${errors.state ? 'border-red-500 focus:border-red-500' : 'focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin" className="text-sm font-medium">Institute PIN Code *</Label>
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
