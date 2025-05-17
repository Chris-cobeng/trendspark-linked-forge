
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onGetStarted: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onGetStarted }) => {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for trying out LinkedCraft",
      features: [
        "2 AI-generated posts per month",
        "Basic topic suggestions",
        "Standard post templates",
        "Email support"
      ],
      isPopular: false
    },
    {
      name: "Basic",
      price: "9",
      description: "Ideal for regular content creators",
      features: [
        "15 AI-generated posts per month",
        "Trending topic suggestions",
        "Post scheduling (up to 7 days)",
        "Basic analytics",
        "Priority email support"
      ],
      isPopular: true
    },
    {
      name: "Pro",
      price: "39",
      description: "For serious LinkedIn influencers",
      features: [
        "Unlimited AI-generated posts",
        "Premium topic suggestions",
        "Advanced post scheduling",
        "Comprehensive analytics",
        "Visual content generation",
        "Dedicated account manager"
      ],
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose the perfect plan for your LinkedIn content needs
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              className={`rounded-xl overflow-hidden ${
                plan.isPopular 
                  ? 'border-2 border-linkedBlue ring-2 ring-blue-100 shadow-xl' 
                  : 'border border-gray-200 shadow-md'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {plan.isPopular && (
                <div className="bg-linkedBlue text-white text-center py-2 font-medium text-sm">
                  Most Popular
                </div>
              )}
              <div className={`p-8 ${!plan.isPopular ? 'pt-10' : ''}`}>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-1 bg-green-100 p-1 rounded-full">
                        <Check className="h-3 w-3 text-green-600" />
                      </span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={onGetStarted} 
                  className={`w-full ${
                    plan.isPopular 
                      ? 'bg-gradient-to-r from-pink-500 to-linkedBlue text-white hover:scale-105' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-all`}
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
