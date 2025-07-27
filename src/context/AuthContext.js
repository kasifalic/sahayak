import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChangedListener, signOutUser } from '../firebase';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      
      if (user) {
        // Always show welcome page for grade selection on each login
        // Remove stored profile check to ensure welcome page appears every time
        setUserProfile(null); // Always trigger welcome setup
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
      
      // Clear any stored profile data to ensure fresh start next login
      if (currentUser?.uid) {
        localStorage.removeItem(`sahayak_profile_${currentUser.uid}`);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const completeProfile = (profile) => {
    setUserProfile(profile);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    profileCompleted: !!userProfile,
    loading,
    logout,
    completeProfile,
    // User info for compatibility with existing code
    user: userProfile || (currentUser ? {
      firstName: currentUser.displayName?.split(' ')[0] || 'Teacher',
      lastName: currentUser.displayName?.split(' ')[1] || '',
      email: currentUser.email,
      uid: currentUser.uid,
      profileCompleted: false,
      teachingGrades: [],
      schoolName: 'Your School',
      district: 'Your District',
      phoneNumber: 'Not provided'
    } : null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 