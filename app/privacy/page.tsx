"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information such as name, email address, and contact details when you register for Novothon",
        "Educational information including institution name, course of study, and academic year",
        "Technical information such as IP address, browser type, and device information",
        "Usage data including pages visited, time spent on our platform, and interaction patterns",
        "Project submissions, code repositories, and presentation materials during the hackathon"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "To process your registration and manage your participation in Novothon",
        "To communicate with you about event updates, schedules, and important announcements",
        "To evaluate submissions and determine winners fairly and transparently",
        "To improve our platform, services, and future hackathon experiences",
        "To comply with legal obligations and protect our legitimate interests"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your personal information",
        "All data transmission is encrypted using SSL/TLS protocols",
        "Access to personal information is restricted to authorized personnel only",
        "We regularly update our security practices and conduct security audits",
        "In the event of a data breach, we will notify affected users within 72 hours"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Information may be shared with event sponsors and partners only with your explicit consent",
        "We may share aggregated, anonymized data for research and improvement purposes",
        "Legal authorities may access information if required by law or to protect our rights",
        "Service providers who assist in platform operation are bound by confidentiality agreements"
      ]
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        "Right to access: You can request a copy of all personal information we hold about you",
        "Right to rectification: You can request correction of inaccurate or incomplete information",
        "Right to erasure: You can request deletion of your personal information",
        "Right to portability: You can request transfer of your data to another service",
        "Right to withdraw consent: You can withdraw consent for data processing at any time"
      ]
    },
    {
      icon: Mail,
      title: "Contact & Updates",
      content: [
        "This privacy policy may be updated periodically to reflect changes in our practices",
        "We will notify users of significant changes via email or platform notifications",
        "For privacy-related questions or concerns, contact us at privacy@novothon.com",
        "To exercise your rights or file a complaint, reach out to our data protection team",
        "This policy is effective as of March 1, 2024, and governs all data processing activities"
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
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Novothon's Privacy Policy. This document outlines how we handle your personal information 
            when you participate in our hackathon events, use our platform, or interact with our services. 
            We are committed to protecting your privacy and ensuring transparency in our data practices. 
            By using our services, you agree to the collection and use of information in accordance with this policy.
          </p>
        </motion.div>

        {/* Policy Sections */}
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

        {/* Contact Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mt-12 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Questions About This Policy?</h2>
          <p className="text-blue-100 mb-6">
            If you have any questions about this Privacy Policy or our data practices, 
            we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:privacy@novothon.com"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              privacy@novothon.com
            </a>
            <a 
              href="mailto:legal@novothon.com"
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              legal@novothon.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
