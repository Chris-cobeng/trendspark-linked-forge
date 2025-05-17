
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          <DialogTitle className="text-center text-2xl font-bold">
            {type === 'login' ? 'Log In to LinkedCraft' : 'Create Your LinkedCraft Account'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <AuthForm 
            type={type} 
            onSuccess={onSuccess}
            onChangeType={onChangeType}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
