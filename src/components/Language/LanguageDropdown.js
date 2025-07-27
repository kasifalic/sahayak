import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageDropdown = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
        style={{
          fontFamily: currentLanguage.code === 'en' ? 'inherit' : 
                     currentLanguage.code === 'hi' ? 'Noto Sans Devanagari, sans-serif' :
                     currentLanguage.code === 'ta' ? 'Noto Sans Tamil, sans-serif' :
                     currentLanguage.code === 'te' ? 'Noto Sans Telugu, sans-serif' :
                     currentLanguage.code === 'kn' ? 'Noto Sans Kannada, sans-serif' : 'inherit'
        }}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-700">{currentLanguage.name}</span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-48 py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors
                  ${i18n.language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                `}
                style={{
                  fontFamily: lang.code === 'en' ? 'inherit' : 
                             lang.code === 'hi' ? 'Noto Sans Devanagari, sans-serif' :
                             lang.code === 'ta' ? 'Noto Sans Tamil, sans-serif' :
                             lang.code === 'te' ? 'Noto Sans Telugu, sans-serif' :
                             lang.code === 'kn' ? 'Noto Sans Kannada, sans-serif' : 'inherit'
                }}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {i18n.language === lang.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageDropdown; 