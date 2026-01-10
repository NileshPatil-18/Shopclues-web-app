// components/Debug/LoginDebug.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const LoginDebug = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  
  useEffect(() => {
    console.log('=== LOGIN DEBUG ===');
    console.log('isLoggedIn:', isLoggedIn);
    console.log('User:', user);
    console.log('User role:', user?.role);
    console.log('Type of user:', typeof user);
    
    // Check localStorage
    const storedUser = localStorage.getItem('user');
    console.log('LocalStorage user:', storedUser ? JSON.parse(storedUser) : 'No user');
    console.log('===================');
  }, [user, isLoggedIn]);

  return null;
};

export default LoginDebug;