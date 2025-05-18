
import React from 'react';
import { useAuth } from '../context/AuthContext';
import GeneratePage from './GeneratePage';
import Home from './Home';

const Index = () => {
  const { user } = useAuth();
  
  // Redirect based on authentication status
  return user ? <GeneratePage /> : <Home />;
};

export default Index;
