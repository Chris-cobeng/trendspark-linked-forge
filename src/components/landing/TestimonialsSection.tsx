
import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "LinkedCraft tripled my LinkedIn engagement in just three weeks! The AI-generated posts are surprisingly insightful and save me hours of brainstorming.",
    author: "Jane Doe",
    role: "Marketing Director",
    company: "TechGrowth Inc.",
    avatar: "/avatars/jane.jpg"
  },
  {
    quote: "As a startup founder, I need to maintain a strong LinkedIn presence but don't have the time. LinkedCraft is the perfect solution - quality content with minimal effort.",
    author: "Michael Chen",
    role: "CEO",
    company: "InnovateSphere",
    avatar: "/avatars/michael.jpg"
  },
  {
    quote: "The trending topics feature is a game-changer. I'm always posting relevant content before my competitors even know what's trending.",
    author: "Sarah Johnson",
    role: "Content Strategist",
    company: "DigitalPulse Media",
    avatar: "/avatars/sarah.jpg"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of professionals who are growing their network with LinkedCraft
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                  {/* Avatar placeholder */}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center p-2 bg-blue-50 rounded-full">
            <span className="px-3 py-1 bg-linkedBlue text-white rounded-full text-sm font-medium">4.9/5</span>
            <span className="px-3 text-sm font-medium text-gray-700">from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
