
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does LinkedCraft generate posts?",
    answer: "LinkedCraft uses advanced AI models trained on high-performing LinkedIn content. Our system analyzes your industry, preferences, and trending topics to generate engaging posts that resonate with your professional audience."
  },
  {
    question: "Is my data secure with Supabase?",
    answer: "Absolutely! We use Supabase, a modern backend-as-a-service platform built on PostgreSQL. Your data is encrypted both in transit and at rest, and we never sell your information to third parties."
  },
  {
    question: "Can I schedule posts in advance?",
    answer: "Yes! Our Pro and Basic plans include a smart scheduling feature that lets you queue posts for optimal publishing times. The system even suggests the best times based on LinkedIn engagement data."
  },
  {
    question: "What makes LinkedCraft different from other tools?",
    answer: "LinkedCraft stands out with its real-time LinkedIn trend integration, professional-focused AI that understands corporate communication, and our unique optimization suggestions tailored for LinkedIn's algorithm."
  },
  {
    question: "Can I try LinkedCraft before subscribing?",
    answer: "Definitely! Our Free plan allows you to generate up to 2 posts per month with basic features. No credit card required to get started."
  },
  {
    question: "What happens if I exceed my monthly post limit?",
    answer: "If you reach your monthly limit, you'll need to wait until the next billing cycle or upgrade your plan to continue generating posts. We'll notify you when you're approaching your limit."
  }
];

const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to know about LinkedCraft
          </motion.p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="border border-gray-200 bg-white rounded-lg mb-4 overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-left font-medium text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Still have questions?</p>
          <a 
            href="#contact" 
            className="text-linkedBlue font-medium hover:underline"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
