"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "What is Novothon?",
    answer: "Novothon is a 48-hour hackathon where developers, designers, and innovators come together to create solutions for real-world problems. It's an opportunity to learn, network, and win amazing prizes."
  },
  {
    question: "Who can participate?",
    answer: "Novothon is open to students, professionals, and anyone passionate about technology and innovation. Whether you're a beginner or an expert, we welcome participants from all skill levels."
  },
  {
    question: "Do I need a team?",
    answer: "You can participate solo or form a team of up to 4 members. We also have team formation sessions during the event if you're looking to join others with complementary skills."
  },
  {
    question: "What should I bring?",
    answer: "Bring your laptop, chargers, and any hardware you might need for your project. We'll provide food, drinks, internet, and a comfortable workspace for the duration of the event."
  },
  {
    question: "Is there a registration fee?",
    answer: "No, Novothon is completely free to participate! We believe in making innovation accessible to everyone. Just register online and show up ready to build."
  },
  {
    question: "What are the prizes?",
    answer: "We have amazing prizes including ₹50,000 for the winner, ₹25,000 for runner-up, ₹15,000 for third place, plus special category prizes worth ₹5,000 each."
  },
  {
    question: "Will there be mentors available?",
    answer: "Yes! We have industry experts and experienced developers available throughout the event to provide guidance, technical support, and feedback on your projects."
  },
  {
    question: "How are projects judged?",
    answer: "Projects are evaluated based on innovation, technical implementation, design, presentation, and potential impact. Our panel consists of industry professionals and technical experts."
  }
];

export const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ rotate: -360, y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-pink-300/20 rounded-full blur-xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers! Find everything you need to know about Novothon.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-white/50 transition-colors"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.9)" }}
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-800 pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                </motion.div>
              </motion.button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
            <p className="text-blue-100 mb-4">
              Can't find what you're looking for? Our team is here to help!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
