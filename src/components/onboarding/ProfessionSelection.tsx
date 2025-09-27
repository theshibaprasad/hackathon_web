"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Briefcase, CheckCircle } from 'lucide-react';
import { OnboardingFormData } from '@/types/onboarding';

interface ProfessionSelectionProps {
  data: OnboardingFormData;
  updateData: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
}

export default function ProfessionSelection({ data, updateData, onNext }: ProfessionSelectionProps) {
  const [selectedProfession, setSelectedProfession] = useState<'student' | 'working_professional' | null>(data.profession || null);

  const handleProfessionSelect = (profession: 'student' | 'working_professional') => {
    setSelectedProfession(profession);
    updateData({ profession });
  };

  const handleNext = () => {
    if (selectedProfession) {
      onNext();
    }
  };

  const professions = [
    {
      id: 'student',
      title: 'Student',
      description: 'I am currently pursuing my education',
      icon: GraduationCap,
      features: [
        'Access to student-exclusive hackathons',
        'Connect with fellow students',
        'Build projects for your portfolio'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'working_professional',
      title: 'Working Professional',
      description: 'I am currently employed or freelancing',
      icon: Briefcase,
      features: [
        'Access to professional hackathons',
        'Network with industry experts',
        'Showcase your expertise',
        'Find potential collaborators'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          What best describes you?
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
          Choose your profession to get a personalized experience tailored to your background
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {professions.map((profession) => {
          const Icon = profession.icon;
          const isSelected = selectedProfession === profession.id;
          
          return (
            <motion.div
              key={profession.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card
                className={`cursor-pointer transition-all duration-200 h-full flex flex-col ${
                  isSelected
                    ? `border-2 border-primary ${profession.bgColor} shadow-lg`
                    : `border-2 ${profession.borderColor} hover:shadow-md`
                }`}
                onClick={() => handleProfessionSelect(profession.id as 'student' | 'working_professional')}
              >
                <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    <div className={`p-2 sm:p-3 rounded-lg ${profession.bgColor} flex-shrink-0`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? 'text-primary' : 'text-gray-600'}`} />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {profession.title}
                        </h3>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                        {profession.description}
                      </p>
                      
                      <div className="flex-1">
                        <ul className="space-y-1 sm:space-y-2">
                          {profession.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-xs sm:text-sm text-gray-600">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full mr-2 mt-1.5 sm:mt-2 flex-shrink-0" />
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end pt-6 sm:pt-8">
        <Button
          onClick={handleNext}
          disabled={!selectedProfession}
          className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <motion.div
            className="ml-2"
            animate={{ x: selectedProfession ? 0 : -5 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.div>
        </Button>
      </div>
    </div>
  );
}
