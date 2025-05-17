import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSuccess: () => void;
  onChangeType: (type: 'login' | 'signup') => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess, onChangeType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper function to clean up any existing auth state
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Clean up existing auth state before attempting login/signup
      cleanupAuthState();
      
      // Attempt global sign out before new sign in
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      if (type === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              company: company
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created successfully!",
          description: "Please check your email for verification."
        });
        
        // In development, you might want to automatically sign in after signup
        // since email verification might be turned off
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!signInError && signInData.user) {
          // Force page reload to refresh auth state
          window.location.href = '/dashboard';
        } else {
          onSuccess();
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: "Logged in successfully!",
          description: "Welcome back to LinkedCraft."
        });
        
        // Redirect to dashboard with page reload for clean state
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'signup' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          {type === 'login' && (
            <a href="#" className="text-sm text-linkedBlue hover:underline">
              Forgot password?
            </a>
          )}
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-pink-500 to-linkedBlue text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : type === 'login' ? 'Log In' : 'Sign Up'}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-gray-500">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button 
          type="button"
          onClick={() => onChangeType(type === 'login' ? 'signup' : 'login')}
          className="text-linkedBlue hover:underline font-medium"
        >
          {type === 'login' ? 'Sign Up' : 'Log In'}
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => {
            toast({
              title: "Google login",
              description: "Google login will be available soon!"
            });
          }}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => {
            toast({
              title: "GitHub login",
              description: "GitHub login will be available soon!"
            });
          }}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.22.66-.48v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.16.56.67.48A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z"
              fill="currentColor"
            />
          </svg>
          GitHub
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
