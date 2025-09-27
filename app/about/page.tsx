import { Users, Target, Award, Clock, MapPin, Calendar, Heart, Lightbulb, Code, Zap, Globe, Shield, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 mr-3" />
              <h1 className="text-3xl sm:text-5xl font-bold">About Novothon</h1>
            </div>
            <p className="text-lg sm:text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              A 48-hour innovation marathon where creativity meets technology. 
              Join us in building the future, one hack at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12 sm:py-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="w-6 h-6 mr-3 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                To create a platform where innovative minds converge to solve real-world problems 
                through technology. We believe in the power of collaboration, creativity, and 
                cutting-edge solutions to drive positive change in our communities.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Novothon is more than just a hackathon—it's a movement that empowers developers, 
                designers, and entrepreneurs to turn their ideas into reality.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Lightbulb className="w-6 h-6 mr-3 text-yellow-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                To become the premier hackathon that bridges the gap between academic learning 
                and industry innovation. We envision a future where every participant leaves 
                with not just a project, but with the skills and network to make a lasting impact.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our goal is to foster the next generation of tech leaders who will shape 
                the digital landscape of tomorrow.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Event Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Date</h3>
                <p className="text-2xl font-bold text-blue-600">March 15-17</p>
                <p className="text-sm text-gray-600">2024</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                <p className="text-2xl font-bold text-green-600">48 Hours</p>
                <p className="text-sm text-gray-600">Non-stop coding</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-2xl font-bold text-purple-600">Hybrid</p>
                <p className="text-sm text-gray-600">Online + On-site</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Participants</h3>
                <p className="text-2xl font-bold text-orange-600">500+</p>
                <p className="text-sm text-gray-600">Expected attendees</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            What Makes Novothon Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Diverse Themes</CardTitle>
                <CardDescription>
                  From AI/ML to Blockchain, we cover all major tech domains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Choose from 6 different technology tracks, each with unique challenges 
                  and opportunities for innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Expert Mentors</CardTitle>
                <CardDescription>
                  Learn from industry professionals and experienced developers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get guidance from mentors who have built successful products and 
                  have years of industry experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Amazing Prizes</CardTitle>
                <CardDescription>
                  Win cash prizes, internships, and career opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Compete for a total prize pool of ₹50,000+ along with internship 
                  opportunities and networking benefits.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Rapid Innovation</CardTitle>
                <CardDescription>
                  Build, test, and iterate in a fast-paced environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Experience the thrill of rapid prototyping and learn to build 
                  MVPs in record time with real-world constraints.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Global Network</CardTitle>
                <CardDescription>
                  Connect with developers and innovators from around the world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join a community of passionate developers and build lasting 
                  connections that extend beyond the hackathon.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Safe Environment</CardTitle>
                <CardDescription>
                  Inclusive and supportive community for all participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We maintain a strict code of conduct to ensure everyone feels 
                  welcome and can focus on building amazing solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Projects Built</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-purple-600 mb-2">₹50K+</div>
              <div className="text-gray-600">Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-orange-600 mb-2">24</div>
              <div className="text-gray-600">Hours of Coding</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
            <CardContent className="p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Ready to Join the Innovation Revolution?
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Don't miss your chance to be part of something extraordinary. 
                Register now and start your journey towards building the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  Register Now
                </Button>
                <Button variant="outline" size="lg" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3">
                  View Problem Statements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
