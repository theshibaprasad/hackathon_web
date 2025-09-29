"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Code, Brain, Heart, Zap, Shield, Globe, Users, Crown, Loader2 } from 'lucide-react';
import { OnboardingFormData } from '@/types/onboarding';

interface ThemeSelectionProps {
  data: OnboardingFormData;
  updateData: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface DynamicTheme {
  _id: string;
  name: string;
  description: string;
  problemStatements: {
    _id: string;
    title: string;
    description: string;
  }[];
}

interface DynamicProblemStatement {
  _id: string;
  title: string;
  description: string;
}

// Icon mapping for different theme types
const getThemeIcon = (themeName: string) => {
  const name = themeName.toLowerCase();
  if (name.includes('ai') || name.includes('machine learning') || name.includes('artificial intelligence')) return Brain;
  if (name.includes('web') || name.includes('frontend') || name.includes('backend')) return Code;
  if (name.includes('mobile') || name.includes('app')) return Zap;
  if (name.includes('blockchain') || name.includes('web3') || name.includes('crypto')) return Shield;
  if (name.includes('iot') || name.includes('internet of things') || name.includes('smart')) return Globe;
  if (name.includes('fintech') || name.includes('finance') || name.includes('payment')) return Heart;
  return Code; // Default icon
};

// Color mapping for different theme types
const getThemeColors = (themeName: string) => {
  const name = themeName.toLowerCase();
  if (name.includes('ai') || name.includes('machine learning') || name.includes('artificial intelligence')) {
    return { color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' };
  }
  if (name.includes('web') || name.includes('frontend') || name.includes('backend')) {
    return { color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
  }
  if (name.includes('mobile') || name.includes('app')) {
    return { color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
  }
  if (name.includes('blockchain') || name.includes('web3') || name.includes('crypto')) {
    return { color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
  }
  if (name.includes('iot') || name.includes('internet of things') || name.includes('smart')) {
    return { color: 'from-indigo-500 to-purple-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' };
  }
  if (name.includes('fintech') || name.includes('finance') || name.includes('payment')) {
    return { color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' };
  }
  return { color: 'from-gray-500 to-slate-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
};

export default function ThemeSelection({ data, updateData, onNext, onPrev }: ThemeSelectionProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>(data.themeId || '');
  const [selectedProblemStatement, setSelectedProblemStatement] = useState<string>(data.problemId || '');
  const [teamName, setTeamName] = useState<string>(data.teamName || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Dynamic data state
  const [themes, setThemes] = useState<DynamicTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch themes from API
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/themes');
        if (!response.ok) {
          throw new Error('Failed to fetch themes');
        }
        const data = await response.json();
        setThemes(data.themes || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError('Failed to load themes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const handleThemeToggle = (themeId: string) => {
    // Allow only one theme selection
    const newSelectedTheme = selectedTheme === themeId ? '' : themeId;
    
    setSelectedTheme(newSelectedTheme);
    updateData({ themeId: newSelectedTheme });
    
    // Clear problem statement when theme changes
    setSelectedProblemStatement('');
    updateData({ problemId: '' });
  };

  const handleProblemStatementToggle = (statement: string) => {
    // Allow only one problem statement selection
    const newSelectedStatement = selectedProblemStatement === statement ? '' : statement;
    
    setSelectedProblemStatement(newSelectedStatement);
    updateData({ problemId: newSelectedStatement });
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

    if (!selectedTheme) {
      newErrors.themes = 'Please select a theme';
    }

    if (!selectedProblemStatement) {
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
    const selectedThemeData = themes.find(theme => theme._id === selectedTheme);
    return selectedThemeData?.problemStatements || [];
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Choose Your Interest
          </h2>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            Loading themes and problem statements...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Choose Your Interest
          </h2>
          <p className="text-red-600 text-sm sm:text-base px-4">
            {error}
          </p>
        </div>
        <div className="text-center py-12">
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Choose Your Interest
        </h2>
        <p className="text-gray-600 text-sm sm:text-base px-4">
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
        {themes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No themes available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {themes.map((theme) => {
              const Icon = getThemeIcon(theme.name);
              const colors = getThemeColors(theme.name);
              const isSelected = selectedTheme === theme._id;
              
              return (
                <Card
                  key={theme._id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `border-2 border-primary ${colors.bgColor} shadow-lg`
                      : `border-2 ${colors.borderColor} hover:shadow-md`
                  }`}
                  onClick={() => handleThemeToggle(theme._id)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${colors.bgColor}`}>
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-primary' : 'text-gray-600'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {theme.name.replace(/<[^>]*>/g, '')}
                          </h4>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleThemeToggle(theme._id)}
                            className="ml-2"
                          />
                        </div>
                        <Badge variant="secondary" className="text-xs mt-2">
                          {theme.problemStatements.length} problems
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {errors.themes && <p className="text-sm text-red-500">{errors.themes}</p>}
      </div>

      {/* Problem Statements Selection */}
      {selectedTheme && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Select a Problem Statement *</h3>
          <p className="text-sm text-gray-600">
            Select the problem statement you'd like to work on
          </p>
          <div className="space-y-3">
            {getAvailableProblemStatements().map((statement) => (
              <Card
                key={statement._id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedProblemStatement === statement._id
                    ? 'border-2 border-primary bg-primary/5'
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleProblemStatementToggle(statement._id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedProblemStatement === statement._id}
                      onChange={() => handleProblemStatementToggle(statement._id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {statement.title.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.problemStatements && <p className="text-sm text-red-500">{errors.problemStatements}</p>}
        </div>
      )}

      {/* Selected Summary */}
      {(teamName || selectedTheme) && (
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
                {selectedTheme ? (themes.find(t => t._id === selectedTheme)?.name || 'Selected').replace(/<[^>]*>/g, '') : 'Not selected'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Problem Statement: </span>
              <span className="text-sm text-gray-600">
                {selectedProblemStatement ? 
                  (getAvailableProblemStatements().find(ps => ps._id === selectedProblemStatement)?.title || 'Selected').replace(/<[^>]*>/g, '')
                  : 'Not selected'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md transition-all duration-200 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
