
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import heroImage from '/public/hero-image.svg';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Create LinkedIn Posts That 
              <span className="text-linkedBlue"> Get Noticed</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Save time with AI-generated posts tailored to your industry. Leverage real-time trends and analytics to boost your professional presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onGetStarted} 
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-linkedBlue text-white text-lg transition-transform hover:scale-105"
              >
                Sign Up Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-linkedBlue text-linkedBlue text-lg"
              >
                View Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-white">
                    {i}
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-600">
                <span className="font-medium">1,000+</span> professionals already using LinkedCraft
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-linkedBlue/20 to-pink-500/20 rounded-xl blur-xl"></div>
              <div className="relative bg-white rounded-xl shadow-xl p-4 border border-gray-200">
                <img 
                  src={heroImage} 
                  alt="LinkedCraft AI Post Generator" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-900">Average Engagement</div>
                  <div className="text-xl font-bold text-linkedBlue">+187%</div>
                  <div className="text-xs text-green-600">↑ 24% this month</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,42.7C672,32,768,32,864,48C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
