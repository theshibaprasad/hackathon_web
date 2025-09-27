import { BookOpen, Clock, Users, Award, Shield, AlertTriangle, CheckCircle, XCircle, Info, Calendar, MapPin, Trophy, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function GuidelinesPage() {
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 mr-3" />
              <h1 className="text-3xl sm:text-5xl font-bold">Hackathon Guidelines</h1>
            </div>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Everything you need to know to participate successfully in Novothon. 
              Follow these guidelines to ensure a smooth and fair competition.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12 sm:py-16">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
              <p className="text-2xl font-bold text-blue-600">48 Hours</p>
              <p className="text-sm text-gray-600">Non-stop coding</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Team Size</h3>
              <p className="text-2xl font-bold text-green-600">1-4 Members</p>
              <p className="text-sm text-gray-600">Maximum per team</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Prizes</h3>
              <p className="text-2xl font-bold text-purple-600">₹50,000+</p>
              <p className="text-sm text-gray-600">Total prize pool</p>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines Sections */}
        <div className="space-y-8">
          {/* General Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Shield className="w-6 h-6 mr-3 text-blue-600" />
                General Rules & Regulations
              </CardTitle>
              <CardDescription>
                Fundamental rules that all participants must follow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    What's Allowed
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Use any programming language or framework</li>
                    <li>• Utilize open-source libraries and APIs</li>
                    <li>• Work on any device (laptop, desktop, mobile)</li>
                    <li>• Collaborate with team members</li>
                    <li>• Use cloud services and databases</li>
                    <li>• Seek help from mentors and organizers</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    What's Not Allowed
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Pre-written code or solutions</li>
                    <li>• Plagiarism or copying others' work</li>
                    <li>• Working with external teams</li>
                    <li>• Using paid services without permission</li>
                    <li>• Violating any laws or regulations</li>
                    <li>• Inappropriate or offensive content</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline & Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Calendar className="w-6 h-6 mr-3 text-green-600" />
                Timeline & Schedule
              </CardTitle>
              <CardDescription>
                Important dates and milestones for the hackathon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Registration Opens</h4>
                    <p className="text-sm text-gray-600">Early bird registration with special pricing</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-700">Ongoing</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hackathon Begins</h4>
                    <p className="text-sm text-gray-600">Opening ceremony, theme announcement, and coding starts</p>
                    <Badge className="mt-2 bg-green-100 text-green-700">Day 1 - 9:00 AM</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mid-Point Check</h4>
                    <p className="text-sm text-gray-600">Progress review and mentor feedback session</p>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-700">Day 2 - 2:00 PM</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Submission Deadline</h4>
                    <p className="text-sm text-gray-600">Final project submission and presentation preparation</p>
                    <Badge className="mt-2 bg-purple-100 text-purple-700">Day 3 - 9:00 AM</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Judging & Awards</h4>
                    <p className="text-sm text-gray-600">Project presentations, judging, and prize distribution</p>
                    <Badge className="mt-2 bg-red-100 text-red-700">Day 3 - 2:00 PM</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Trophy className="w-6 h-6 mr-3 text-yellow-600" />
                Submission Guidelines
              </CardTitle>
              <CardDescription>
                How to submit your project for evaluation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  All submissions must be made through the official platform before the deadline. 
                  Late submissions will not be accepted.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Required Deliverables</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Working prototype or demo
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Source code repository (GitHub/GitLab)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Project documentation
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Presentation slides (5-7 minutes)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Team information and roles
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Evaluation Criteria</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      Innovation and creativity (25%)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      Technical implementation (30%)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      Problem relevance (20%)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      Presentation quality (15%)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      Market potential (10%)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code of Conduct */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Shield className="w-6 h-6 mr-3 text-red-600" />
                Code of Conduct
              </CardTitle>
              <CardDescription>
                Our commitment to creating an inclusive and respectful environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  We are committed to providing a harassment-free experience for everyone. 
                  Violations of this code of conduct will result in immediate disqualification.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Expected Behavior</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Be respectful and inclusive</li>
                    <li>• Use welcoming and inclusive language</li>
                    <li>• Be respectful of differing viewpoints</li>
                    <li>• Accept constructive criticism gracefully</li>
                    <li>• Focus on what's best for the community</li>
                    <li>• Show empathy towards others</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Unacceptable Behavior</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Harassment or discrimination</li>
                    <li>• Inappropriate comments or behavior</li>
                    <li>• Trolling, insulting, or derogatory comments</li>
                    <li>• Public or private harassment</li>
                    <li>• Publishing private information</li>
                    <li>• Any conduct inappropriate in a professional setting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardContent className="p-8 sm:p-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Need Help or Have Questions?
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Our team is here to help you succeed. Reach out to us for any questions 
                about the guidelines, technical issues, or general support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Contact Support
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                  Join Discord
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
