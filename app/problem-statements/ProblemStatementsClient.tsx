"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Code, Zap, Shield, Globe, Heart, ArrowRight, CheckCircle, Lightbulb, Target, Users, Clock, ArrowLeft, Eye, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';

interface ProblemStatement {
  _id: string;
  title: string;
  description: string;
}

interface Theme {
  _id: string;
  name: string;
  description: string;
  problemStatements: ProblemStatement[];
}

const themeIcons = {
  'Artificial Intelligence': Brain,
  'Web Development': Code,
  'Mobile Development': Zap,
  'Blockchain': Shield,
  'IoT': Globe,
  'FinTech': Heart,
  'default': Target
};

const themeColors = {
  'Artificial Intelligence': {
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600'
  },
  'Web Development': {
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600'
  },
  'Mobile Development': {
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600'
  },
  'Blockchain': {
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600'
  },
  'IoT': {
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-600'
  },
  'FinTech': {
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-600'
  },
  'default': {
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-600'
  }
};

export default function ProblemStatementsClient() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProblemStatement, setSelectedProblemStatement] = useState<ProblemStatement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleThemes, setVisibleThemes] = useState<Theme[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchThemes();
  }, []);

  // Lazy loading with intersection observer
  useEffect(() => {
    if (themes.length > 0) {
      // Initially show first 2 themes
      setVisibleThemes(themes.slice(0, 2));
    }
  }, [themes]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && visibleThemes.length < themes.length) {
            setLoadingMore(true);
            // Simulate loading delay for better UX
            setTimeout(() => {
              const nextBatch = themes.slice(visibleThemes.length, visibleThemes.length + 2);
              setVisibleThemes(prev => [...prev, ...nextBatch]);
              setLoadingMore(false);
            }, 500);
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleThemes.length, themes.length]);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes');
      if (response.ok) {
        const data = await response.json();
        setThemes(data.themes);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeIcon = (themeName: string) => {
    return themeIcons[themeName as keyof typeof themeIcons] || themeIcons.default;
  };

  const getThemeColors = (themeName: string) => {
    return themeColors[themeName as keyof typeof themeColors] || themeColors.default;
  };

  const openProblemStatementModal = (problemStatement: ProblemStatement) => {
    setSelectedProblemStatement(problemStatement);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
              </div>
              <div className="w-20 h-6 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 sm:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse mr-3" />
                <div className="w-64 h-12 bg-white/20 rounded animate-pulse" />
              </div>
              <div className="w-96 h-6 bg-white/20 rounded animate-pulse mx-auto mb-8" />
              <div className="flex flex-wrap justify-center gap-4">
                <div className="w-20 h-8 bg-white/20 rounded-full animate-pulse" />
                <div className="w-32 h-8 bg-white/20 rounded-full animate-pulse" />
                <div className="w-24 h-8 bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 max-w-6xl py-12 sm:py-16">
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-64 h-8 bg-gray-300 rounded animate-pulse mx-auto mb-4" />
            <div className="w-96 h-4 bg-gray-300 rounded animate-pulse mx-auto" />
          </div>

          {/* Themes Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-2 bg-gray-300" />
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg" />
                    <div className="flex-1">
                      <div className="w-48 h-6 bg-gray-300 rounded mb-2" />
                      <div className="w-64 h-4 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-32 h-4 bg-gray-300 rounded" />
                      <div className="w-16 h-6 bg-gray-300 rounded" />
                    </div>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-gray-100 rounded-lg">
                        <div className="w-4 h-4 bg-gray-300 rounded" />
                        <div className="flex-1">
                          <div className="w-full h-3 bg-gray-300 rounded mb-1" />
                          <div className="w-3/4 h-3 bg-gray-300 rounded" />
                        </div>
                        <div className="w-6 h-6 bg-gray-300 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-blue-600">NOVOTHON</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Lightbulb className="w-8 h-8 sm:w-12 sm:h-12 mr-3" />
              <h1 className="text-3xl sm:text-5xl font-bold">Problem Statements</h1>
            </div>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Explore innovative challenges across multiple technology domains. 
              Choose your theme and tackle real-world problems with cutting-edge solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                <span>{themes.length} Themes</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                <span>{themes.reduce((total, theme) => total + theme.problemStatements.length, 0)}+ Problem Statements</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                <span>48 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12 sm:py-16">
        {/* Introduction */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Choose Your Challenge
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Each theme offers unique problem statements designed to test your creativity, 
            technical skills, and ability to build solutions that make a real impact.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleThemes.map((theme) => {
            const Icon = getThemeIcon(theme.name);
            const colors = getThemeColors(theme.name);
            
            return (
              <Card key={theme._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className={`h-2 bg-gradient-to-r ${colors.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${colors.bgColor} flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.textColor}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {theme.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        {theme.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Problem Statements</h3>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {theme.problemStatements.length} challenges
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {theme.problemStatements.map((problemStatement) => (
                        <div key={problemStatement._id} className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-gray-200 hover:border-blue-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="p-1.5 bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1">
                                  {problemStatement.title}
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">
                                  Theme: <span className="font-medium text-blue-600">{theme.name}</span>
                                </p>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    Problem Statement
                                  </Badge>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">Click to view details</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openProblemStatementModal(problemStatement)}
                              className="ml-3 h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {/* Skeleton cards for loading more */}
          {loadingMore && [...Array(2)].map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
              <div className="h-2 bg-gray-300" />
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg" />
                  <div className="flex-1">
                    <div className="w-48 h-6 bg-gray-300 rounded mb-2" />
                    <div className="w-64 h-4 bg-gray-300 rounded" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-32 h-4 bg-gray-300 rounded" />
                    <div className="w-16 h-6 bg-gray-300 rounded" />
                  </div>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-gray-100 rounded-lg">
                      <div className="w-4 h-4 bg-gray-300 rounded" />
                      <div className="flex-1">
                        <div className="w-full h-3 bg-gray-300 rounded mb-1" />
                        <div className="w-3/4 h-3 bg-gray-300 rounded" />
                      </div>
                      <div className="w-6 h-6 bg-gray-300 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">Loading more themes...</span>
            </div>
          </div>
        )}

        {/* Intersection Observer Trigger */}
        {visibleThemes.length < themes.length && (
          <div ref={loadMoreRef} className="h-10" />
        )}

        {themes.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No themes available</h3>
            <p className="text-gray-600">Problem statements will be available soon.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardContent className="p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Ready to Build Something Amazing?
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of developers, designers, and innovators in creating 
                solutions that will shape the future of technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transition-all duration-200 hover:shadow-lg">
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/guidelines">
                  <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-3 transition-all duration-200 hover:shadow-md">
                    View Guidelines
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Problem Statement Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    {selectedProblemStatement && themes.find(t => 
                      t.problemStatements.some(ps => ps._id === selectedProblemStatement._id)
                    )?.name}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                  {selectedProblemStatement?.title}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  Detailed description and requirements for this problem statement
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-6">
            {selectedProblemStatement && (
              <div className="space-y-6">
                {/* Problem Statement Content */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Problem Description
                  </h3>
                  <div 
                    className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: selectedProblemStatement.description }}
                  />
                </div>


                {/* Call to Action */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Ready to take on this challenge?</h4>
                      <p className="text-sm text-gray-600">Register now and start building your solution!</p>
                    </div>
                    <div className="flex space-x-3">
                      <Link href="/register">
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          Register Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
