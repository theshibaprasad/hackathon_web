"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Code, Brain, Heart, Zap, Shield, Globe, Users, Crown } from 'lucide-react';
import { OnboardingFormData } from '@/types/onboarding';

interface ThemeSelectionProps {
  data: OnboardingFormData;
  updateData: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const hackathonThemes = [
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Build intelligent solutions using AI/ML technologies',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    problemStatements: [
      'Develop an AI-powered healthcare diagnostic tool',
      'Create a smart recommendation system for e-commerce',
      'Build a natural language processing chatbot',
      'Design a computer vision solution for agriculture',
      'Develop a predictive analytics dashboard'
    ]
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Create innovative web applications and solutions',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    problemStatements: [
      'Build a real-time collaboration platform',
      'Create a progressive web app for education',
      'Develop a social media analytics dashboard',
      'Design a e-commerce platform with advanced features',
      'Build a project management tool'
    ]
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    description: 'Develop mobile applications for iOS and Android',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    problemStatements: [
      'Create a fitness tracking mobile app',
      'Build a food delivery application',
      'Develop a social networking mobile app',
      'Design a productivity and task management app',
      'Create a mobile banking solution'
    ]
  },
  {
    id: 'blockchain',
    title: 'Blockchain & Web3',
    description: 'Explore decentralized applications and blockchain solutions',
    icon: Shield,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    problemStatements: [
      'Develop a DeFi (Decentralized Finance) platform',
      'Create a NFT marketplace',
      'Build a supply chain tracking system',
      'Design a voting system using blockchain',
      'Develop a cryptocurrency wallet'
    ]
  },
  {
    id: 'iot',
    title: 'Internet of Things (IoT)',
    description: 'Connect devices and create smart solutions',
    icon: Globe,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    problemStatements: [
      'Build a smart home automation system',
      'Create an environmental monitoring solution',
      'Develop a smart agriculture system',
      'Design a wearable health monitoring device',
      'Build a smart city traffic management system'
    ]
  },
  {
    id: 'fintech',
    title: 'FinTech',
    description: 'Innovate in financial technology and digital banking',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    problemStatements: [
      'Create a personal finance management app',
      'Build a peer-to-peer lending platform',
      'Develop a digital payment solution',
      'Design a investment portfolio tracker',
      'Create a budgeting and expense tracking tool'
    ]
  }
];

export default function ThemeSelection({ data, updateData, onNext, onPrev }: ThemeSelectionProps) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(data.selectedThemes);
  const [selectedProblemStatements, setSelectedProblemStatements] = useState<string[]>(data.selectedProblemStatements);
  const [teamName, setTeamName] = useState<string>(data.teamName || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleThemeToggle = (themeId: string) => {
    // Allow only one theme selection
    const newSelectedThemes = selectedThemes.includes(themeId) ? [] : [themeId];
    
    setSelectedThemes(newSelectedThemes);
    updateData({ selectedThemes: newSelectedThemes });
    
    // Clear all problem statements when theme changes
    setSelectedProblemStatements([]);
    updateData({ selectedProblemStatements: [] });
  };

  const handleProblemStatementToggle = (statement: string) => {
    // Allow only one problem statement selection
    const newSelectedStatements = selectedProblemStatements.includes(statement) ? [] : [statement];
    
    setSelectedProblemStatements(newSelectedStatements);
    updateData({ selectedProblemStatements: newSelectedStatements });
  };

  const handleTeamNameChange = (value: string) => {
    setTeamName(value);
    updateData({ 
      teamName: value,
      isTeamLeader: true // User is always the team leader
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!teamName.trim()) {
      newErrors.teamName = 'Please enter a team name';
    }

    if (selectedThemes.length === 0) {
      newErrors.themes = 'Please select a theme';
    }

    if (selectedProblemStatements.length === 0) {
      newErrors.problemStatements = 'Please select a problem statement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const getAvailableProblemStatements = () => {
    return hackathonThemes
      .filter(theme => selectedThemes.includes(theme.id))
      .flatMap(theme => theme.problemStatements);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Interest
        </h2>
        <p className="text-gray-600">
          Select a hackathon theme and problem statement that interests you
        </p>
      </div>

      {/* Team Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Team Information</h3>
        </div>
        
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">You are the Team Leader</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamName" className="text-sm font-medium text-gray-700">
                  Team Name *
                </Label>
                <Input
                  id="teamName"
                  type="text"
                  placeholder="Enter your team name"
                  value={teamName}
                  onChange={(e) => handleTeamNameChange(e.target.value)}
                  className="w-full"
                />
                {errors.teamName && (
                  <p className="text-sm text-red-500">{errors.teamName}</p>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> You can add team members after successfully registering for the hackathon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Select a Theme *</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {hackathonThemes.map((theme) => {
            const Icon = theme.icon;
            const isSelected = selectedThemes.includes(theme.id);
            
            return (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? `border-2 border-primary ${theme.bgColor} shadow-lg`
                    : `border-2 ${theme.borderColor} hover:shadow-md`
                }`}
                onClick={() => handleThemeToggle(theme.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${theme.bgColor}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-600'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {theme.title}
                        </h4>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleThemeToggle(theme.id)}
                          className="ml-2"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {theme.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {theme.problemStatements.length} problems
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {errors.themes && <p className="text-sm text-red-500">{errors.themes}</p>}
      </div>

      {/* Problem Statements Selection */}
      {selectedThemes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Select a Problem Statement *</h3>
          <p className="text-sm text-gray-600">
            Select the problem statement you'd like to work on
          </p>
          <div className="space-y-3">
            {getAvailableProblemStatements().map((statement, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedProblemStatements.includes(statement)
                    ? 'border-2 border-primary bg-primary/5'
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleProblemStatementToggle(statement)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedProblemStatements.includes(statement)}
                      onChange={() => handleProblemStatementToggle(statement)}
                      className="mt-0.5"
                    />
                    <p className="text-sm text-gray-700 flex-1">
                      {statement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.problemStatements && <p className="text-sm text-red-500">{errors.problemStatements}</p>}
        </div>
      )}

      {/* Selected Summary */}
      {(teamName || selectedThemes.length > 0) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Selected Summary:</h4>
          <div className="space-y-2">
            {teamName && (
              <div>
                <span className="text-sm font-medium text-gray-700">Team Name: </span>
                <span className="text-sm text-gray-600">{teamName}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-700">Theme: </span>
              <span className="text-sm text-gray-600">
                {selectedThemes.length > 0 ? 'Selected' : 'Not selected'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Problem Statement: </span>
              <span className="text-sm text-gray-600">
                {selectedProblemStatements.length > 0 ? 'Selected' : 'Not selected'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
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
