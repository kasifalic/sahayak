import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../Language/LanguageSelector';

// Multi-Grade Selection Component
const GradeSelectionModal = ({ isOpen, onClose, onSave, selectedGrades, setSelectedGrades }) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const availableGrades = [2, 8, 9, 11, 12];

  const handleGradeToggle = (grade) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter(g => g !== grade));
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('gradeModal.title')}</h2>
        <p className="text-gray-600 mb-6">{t('gradeModal.description')}</p>
        
        <div className="space-y-3 mb-6">
          {availableGrades.map(grade => (
            <label key={grade} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGrades.includes(grade)}
                onChange={() => handleGradeToggle(grade)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">
                Grade {grade} (Class {grade === 11 ? 'XI' : grade === 12 ? 'XII' : grade})
              </span>
            </label>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onSave} 
            disabled={selectedGrades.length === 0}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
              {t('gradeModal.saveSelection')}
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-medium"
            >
              {t('gradeModal.cancel')}
            </button>
        </div>
      </div>
    </div>
  );
};

const WelcomeSetup = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [selectedGrades, setSelectedGrades] = useState([2]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  
  const handleStartTeaching = () => {
    if (selectedGrades.length === 0) {
      setShowGradeModal(true);
      return;
    }

    // Save user preferences and complete setup for current session only
    const userProfile = {
      teachingGrades: selectedGrades,
      firstName: currentUser.displayName?.split(' ')[0] || 'Teacher',
      lastName: currentUser.displayName?.split(' ')[1] || '',
      email: currentUser.email,
      uid: currentUser.uid,
      profileCompleted: true,
      schoolName: 'Your School',
      district: 'Your District',
      phoneNumber: 'Not provided'
    };
    
    // Don't store in localStorage to ensure welcome page shows every login
    // localStorage.setItem(`sahayak_profile_${currentUser.uid}`, JSON.stringify(userProfile));
    
    onComplete(userProfile);
  };

  const handleGradeSave = () => {
    setShowGradeModal(false);
    if (selectedGrades.length > 0) {
      handleStartTeaching();
    }
  };

  const userName = currentUser?.displayName?.split(' ')[0] || 'Teacher';

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🎓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('welcome.title')}</h1>
            <p className="text-gray-600">{t('welcome.subtitle')}</p>
            {currentUser?.displayName && (
              <p className="text-blue-600 font-medium mt-2">{t('welcome.greeting', { name: userName })}</p>
            )}
          </div>

          {/* Grade Selection Display */}
          {/* Language Selection */}
          <LanguageSelector className="mb-6" size="small" />

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('welcome.gradeSelection')}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedGrades.length > 0 ? selectedGrades.map(grade => (
                <span key={grade} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Grade {grade}
                </span>
              )) : (
                <span className="text-gray-500 text-sm">No grades selected</span>
              )}
            </div>
            <button
              onClick={() => setShowGradeModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('welcome.changeGradeSelection')}
            </button>
          </div>
          
          <button
            onClick={handleStartTeaching}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium text-lg"
          >
            {t('welcome.startTeaching')}
          </button>
        </div>
      </div>

      <GradeSelectionModal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        onSave={handleGradeSave}
        selectedGrades={selectedGrades}
        setSelectedGrades={setSelectedGrades}
      />
    </>
  );
};

export default WelcomeSetup; 