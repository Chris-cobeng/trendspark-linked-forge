
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import AuthForm from './AuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'signup';
  onSuccess: () => void;
  onChangeType: (type: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  type,
  onSuccess,
  onChangeType
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-linkedBlue to-accentPink bg-clip-text text-transparent">
            {type === 'login' ? 'Log In to LinkedCraft' : 'Create Your LinkedCraft Account'}
          </DialogTitle>
        </DialogHeader>
        
        <motion.div 
          className="py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthForm 
            type={type} 
            onSuccess={onSuccess}
            onChangeType={onChangeType}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
