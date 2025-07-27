import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ className = "", size = "medium" }) => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-3 py-2',
    large: 'text-lg px-4 py-3'
  };

  return (
    <div className={`language-selector ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('welcome.languageSelection')}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`
              ${sizeClasses[size]}
              flex flex-col items-center justify-center
              border-2 rounded-lg transition-all duration-200
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
              ${i18n.language === lang.code 
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }
            `}
            style={{
              fontFamily: lang.code === 'en' ? 'inherit' : 
                         lang.code === 'hi' ? 'Noto Sans Devanagari, sans-serif' :
                         lang.code === 'ta' ? 'Noto Sans Tamil, sans-serif' :
                         lang.code === 'te' ? 'Noto Sans Telugu, sans-serif' :
                         lang.code === 'kn' ? 'Noto Sans Kannada, sans-serif' : 'inherit'
            }}
          >
            <span className="text-xl mb-1">{lang.flag}</span>
            <span className="font-medium text-xs">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector; 