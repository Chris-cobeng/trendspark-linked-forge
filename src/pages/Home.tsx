
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FaqSection from '@/components/landing/FaqSection';
import Footer from '@/components/landing/Footer';
import AuthModal from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authType, setAuthType] = React.useState<'login' | 'signup'>('signup');
  const navigate = useNavigate();
  const { toast } = useToast();

  const openAuthModal = (type: 'login' | 'signup') => {
    setAuthType(type);
    setAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    openAuthModal('signup');
  };

  const handleLogin = () => {
    openAuthModal('login');
  };

  const onAuthSuccess = () => {
    toast({
      title: "Success!",
      description: "You're now logged in to LinkedCraft",
    });
    navigate('/');
  };

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="bg-background min-h-screen"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-linkedBlue flex items-center">
              <span className="bg-linkedBlue text-white p-1 rounded mr-2 text-sm">LC</span>
              LinkedCraft
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-linkedBlue transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-linkedBlue transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-linkedBlue transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-linkedBlue transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleLogin}
              className="hidden sm:flex"
            >
              Log In
            </Button>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-pink-500 to-linkedBlue text-white transition-transform hover:scale-105"
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </header>

      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection onGetStarted={handleGetStarted} />
        <FaqSection />
      </main>

      <Footer />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        type={authType}
        onSuccess={onAuthSuccess}
        onChangeType={(type) => setAuthType(type)}
      />
    </motion.div>
  );
};

export default Home;
