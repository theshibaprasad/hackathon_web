import { Building2, Heart, Users, Award, Globe, Star, CheckCircle, ArrowRight, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SponsorPage() {
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
      <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 sm:w-12 sm:h-12 mr-3" />
              <h1 className="text-3xl sm:text-5xl font-bold">Become a Sponsor</h1>
            </div>
            <p className="text-lg sm:text-xl text-orange-100 max-w-3xl mx-auto mb-8">
              Partner with us to support the next generation of innovators and 
              connect with top talent in the tech community.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                <span>500+ Participants</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                <span>Global Reach</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                <span>Premium Branding</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12 sm:py-16">
        {/* Why Sponsor */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Sponsor Novothon?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Access Top Talent</CardTitle>
                <CardDescription>
                  Connect with the brightest minds in technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Meet and recruit from a pool of 500+ highly skilled developers, 
                  designers, and entrepreneurs who are passionate about innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Brand Visibility</CardTitle>
                <CardDescription>
                  Showcase your company to a global audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get maximum exposure through our marketing channels, social media, 
                  and event materials reaching thousands of tech enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Community Impact</CardTitle>
                <CardDescription>
                  Support the future of technology and innovation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Be part of fostering the next generation of tech leaders and 
                  contribute to the growth of the developer community.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Innovation Insights</CardTitle>
                <CardDescription>
                  Discover cutting-edge solutions and technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get early access to innovative projects and technologies that 
                  could shape the future of your industry.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Networking Opportunities</CardTitle>
                <CardDescription>
                  Build relationships with industry leaders and peers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with other sponsors, mentors, and industry professionals 
                  in a collaborative and innovative environment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Corporate Social Responsibility</CardTitle>
                <CardDescription>
                  Demonstrate your commitment to tech education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Show your company's dedication to supporting education, 
                  innovation, and the growth of the tech ecosystem.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sponsorship Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Sponsorship Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bronze Tier */}
            <Card className="border-2 border-orange-200 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="bg-orange-100 text-orange-700 w-fit mx-auto mb-4">Bronze</Badge>
                <CardTitle className="text-2xl">Bronze Sponsor</CardTitle>
                <CardDescription>Perfect for startups and growing companies</CardDescription>
                <div className="text-3xl font-bold text-orange-600 mt-4">₹25,000</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Logo on event website</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Social media mentions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">2 free participant slots</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Access to participant resumes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Silver Tier */}
            <Card className="border-2 border-gray-300 hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gray-100 text-gray-700">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <Badge className="bg-gray-100 text-gray-700 w-fit mx-auto mb-4">Silver</Badge>
                <CardTitle className="text-2xl">Silver Sponsor</CardTitle>
                <CardDescription>Ideal for established companies</CardDescription>
                <div className="text-3xl font-bold text-gray-600 mt-4">₹50,000</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Everything in Bronze</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Logo on event materials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">5 free participant slots</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Booth space at venue</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Mentor session opportunity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Gold Tier */}
            <Card className="border-2 border-yellow-400 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="bg-yellow-100 text-yellow-700 w-fit mx-auto mb-4">Gold</Badge>
                <CardTitle className="text-2xl">Gold Sponsor</CardTitle>
                <CardDescription>Maximum visibility and impact</CardDescription>
                <div className="text-3xl font-bold text-yellow-600 mt-4">₹1,00,000</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Everything in Silver</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Title sponsor recognition</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">10 free participant slots</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Keynote speaking opportunity</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom challenge theme</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Exclusive networking dinner</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Overview */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Globe className="w-6 h-6 mr-3 text-blue-600" />
                  Brand Exposure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Logo placement on all marketing materials</li>
                  <li>• Social media promotion across all platforms</li>
                  <li>• Website banner and footer placement</li>
                  <li>• Email newsletter mentions</li>
                  <li>• Press release inclusion</li>
                  <li>• Event photography and video content</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Users className="w-6 h-6 mr-3 text-green-600" />
                  Talent Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Direct access to participant profiles</li>
                  <li>• Resume database access</li>
                  <li>• Networking opportunities with participants</li>
                  <li>• Mentorship and judging opportunities</li>
                  <li>• Exclusive recruitment sessions</li>
                  <li>• Priority access to winning teams</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
            <CardContent className="p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Ready to Partner With Us?
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Join us in supporting the next generation of innovators. 
                Contact our team to discuss sponsorship opportunities and 
                find the perfect package for your organization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">sponsors@novothon.com</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">+91 98765 43210</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">Mumbai, India</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                  Contact Us Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3">
                  Download Sponsorship Kit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
