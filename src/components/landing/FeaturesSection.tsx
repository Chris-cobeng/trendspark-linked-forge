
import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "AI-Powered Post Generation",
    description: "Get high-quality LinkedIn posts tailored to your industry and audience. Select from trending topics or create your own.",
    icon: "💡",
    color: "bg-blue-100"
  },
  {
    title: "Real-time LinkedIn Trends",
    description: "Stay ahead of the curve with our Rapid API integration that delivers the latest LinkedIn trends relevant to your industry.",
    icon: "📈",
    color: "bg-green-100"
  },
  {
    title: "Visual Content Support",
    description: "Upload images or use our AI to generate visuals that complement your posts. Add professional captions with a single click.",
    icon: "🖼️",
    color: "bg-amber-100"
  },
  {
    title: "Smart Scheduling Calendar",
    description: "Plan your content strategy with our intelligent scheduling tool that suggests optimal posting times based on engagement data.",
    icon: "📅",
    color: "bg-purple-100"
  },
  {
    title: "Personalized Topic Suggestions",
    description: "Receive custom topic ideas based on your industry, interests, and audience engagement patterns.",
    icon: "🎯",
    color: "bg-pink-100"
  },
  {
    title: "Post Optimization Tool",
    description: "Enhance your posts with AI-powered suggestions for improved engagement, readability, and professional tone.",
    icon: "✨",
    color: "bg-teal-100"
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Craft Perfect LinkedIn Content
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our AI-powered platform helps you create engaging posts that resonate with your professional network.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`${feature.color} w-14 h-14 flex items-center justify-center rounded-full mb-6`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
