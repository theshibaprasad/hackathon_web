import { Brain, Code, Zap, Shield, Globe, Heart, ArrowRight, CheckCircle, Lightbulb, Target, Users, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

export default function ProblemStatementsPage() {
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
                <span>6 Themes</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                <span>30+ Problem Statements</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {hackathonThemes.map((theme) => {
            const Icon = theme.icon;
            return (
              <Card key={theme.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className={`h-2 bg-gradient-to-r ${theme.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${theme.bgColor} flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${theme.color.replace('from-', 'text-').replace(' to-', '')}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {theme.title}
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
                      {theme.problemStatements.map((statement, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 leading-relaxed">{statement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Register Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                  View Guidelines
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
