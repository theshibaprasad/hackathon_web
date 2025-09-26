"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, Users, Trophy, AlertTriangle, Scale, Gavel } from "lucide-react";

export default function TermsOfService() {
  const sections = [
    {
      icon: Users,
      title: "Eligibility & Registration",
      content: [
        "Participants must be at least 16 years old or have parental consent to participate",
        "Students, professionals, and technology enthusiasts are welcome to join",
        "Registration is free and must be completed before the event deadline",
        "All information provided during registration must be accurate and truthful",
        "Novothon reserves the right to verify participant eligibility and reject applications"
      ]
    },
    {
      icon: FileText,
      title: "Event Rules & Conduct",
      content: [
        "All participants must adhere to our Code of Conduct throughout the event",
        "Harassment, discrimination, or inappropriate behavior will result in immediate disqualification",
        "Teams can consist of 1-4 members, and team formation is allowed during the event",
        "Projects must be original work created during the hackathon timeframe",
        "Use of pre-existing code libraries and frameworks is permitted and encouraged"
      ]
    },
    {
      icon: Trophy,
      title: "Intellectual Property & Submissions",
      content: [
        "Participants retain ownership of their intellectual property and project submissions",
        "By submitting, you grant Novothon a non-exclusive license to showcase your work",
        "Submissions may be featured in promotional materials, social media, and future events",
        "Projects must not infringe on third-party intellectual property rights",
        "Open source submissions are encouraged but not required for participation"
      ]
    },
    {
      icon: Scale,
      title: "Judging & Awards",
      content: [
        "Projects will be evaluated based on innovation, technical implementation, design, and impact",
        "Judging decisions are final and not subject to appeal or review",
        "Winners will be announced during the closing ceremony and notified via email",
        "Prize distribution will occur within 30 days of the event conclusion",
        "Tax obligations for prizes are the sole responsibility of the winners"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Liability & Disclaimers",
      content: [
        "Participation in Novothon is entirely voluntary and at your own risk",
        "Novothon is not liable for any loss, damage, or injury during the event",
        "We do not guarantee the availability or functionality of technical resources",
        "Internet connectivity, power outages, or technical issues may occur",
        "Participants are responsible for backing up their work and project data"
      ]
    },
    {
      icon: Gavel,
      title: "General Terms",
      content: [
        "These terms are governed by the laws of India and subject to local jurisdiction",
        "Novothon reserves the right to modify these terms with reasonable notice",
        "Any disputes will be resolved through binding arbitration in accordance with Indian law",
        "If any provision is found invalid, the remaining terms continue in full effect",
        "Continued participation constitutes acceptance of any updated terms and conditions"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before participating in Novothon. By joining, you agree to these conditions.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: March 1, 2024
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/50 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Novothon! These Terms of Service ("Terms") govern your participation in our hackathon events, 
            use of our platform, and interaction with our community. By registering for or participating in Novothon, 
            you agree to be bound by these Terms. If you do not agree with any part of these terms, 
            please do not participate in our events or use our services.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 2) }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 mt-12"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Important Notice</h3>
              <p className="text-amber-800 leading-relaxed">
                By participating in Novothon, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                These terms may be updated periodically, and continued participation constitutes acceptance of any changes. 
                Please review these terms regularly to stay informed of any updates.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mt-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="text-blue-100 mb-6">
            If you have any questions about these Terms of Service or need clarification, 
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:legal@novothon.com"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              legal@novothon.com
            </a>
            <a 
              href="mailto:support@novothon.com"
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              support@novothon.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
