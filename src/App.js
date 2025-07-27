import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import { DEFAULT_TOPICS, NCERT_SUBJECTS_BY_GRADE } from './utils/constants';
import AIAssistantFloating from './components/AI/AIAssistantFloating';
import LearningWindow from './components/Learning/LearningWindow';
import PrepareLessonWindow from './components/Preparation/PrepareLessonWindow';
import LoginForm from './components/Auth/LoginForm';
import WelcomeSetup from './components/Auth/WelcomeSetup';
import BackendTest from './components/API/BackendTest';
import LanguageDropdown from './components/Language/LanguageDropdown';

// Simple Loading Spinner
const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

// Simple Button Component
const Button = ({ children, onClick, disabled = false, size = 'medium', className = '', variant = 'primary' }) => {
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {children}
    </button>
  );
};



// Enhanced Mock Login Component
// MockLogin component removed as it's no longer needed

// Enhanced Curriculum Component for Multi-Grade
const CreateCurriculum = () => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(user?.teachingGrades?.[0] || 2);
  const [loading, setLoading] = useState(false);
  const [curriculum, setCurriculum] = useState(null);

  const generateResourceLinks = (grade, subjects) => {
    const resources = {};
    const gradeSubjects = NCERT_SUBJECTS_BY_GRADE[grade] || {};
    
    subjects.forEach(subject => {
      const subjectKey = gradeSubjects[subject] || subject.toLowerCase().replace(/\s+/g, '-');
      resources[subject] = {
        english: `/assets/ncert-books/grade-${grade}-${subjectKey}-en.pdf`,
        hindi: `/assets/ncert-books/grade-${grade}-${subjectKey}-hi.pdf`
      };
    });
    return resources;
  };

  const generateMonthlyPlan = (topics) => {
    const months = [
      'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December', 'January', 'February', 'March'
    ];
    
    const subjects = Object.keys(topics);
    const monthlyPlan = {};
    
    months.forEach((month, index) => {
      monthlyPlan[month] = {
        semester: index < 6 ? 1 : 2,
        subjects: {}
      };
      
      subjects.forEach(subject => {
        const subjectTopics = topics[subject];
        const topicsPerMonth = Math.ceil(subjectTopics.length / 12);
        const startIndex = index * topicsPerMonth;
        const endIndex = Math.min(startIndex + topicsPerMonth, subjectTopics.length);
        
        monthlyPlan[month].subjects[subject] = {
          topics: subjectTopics.slice(startIndex, endIndex),
          chapters: generateChapterNumbers(startIndex, endIndex)
        };
      });
    });
    
    return monthlyPlan;
  };

  const printMonthlyPlan = () => {
    const printContent = document.getElementById('monthly-teaching-plan');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sahayak Monthly Teaching Plan</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 8px;
              line-height: 1.3;
              color: #1f2937;
              background: #ffffff;
            }
            .header {
              text-align: center;
              margin-bottom: 16px;
              padding: 12px 0;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              border-radius: 8px;
            }
            .main-title {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 4px;
              letter-spacing: -0.025em;
            }
            .subtitle {
              font-size: 13px;
              opacity: 0.9;
              margin-bottom: 2px;
              font-weight: 400;
            }
            .grade-info {
              font-size: 12px;
              opacity: 0.8;
              font-weight: 300;
            }
            .month-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              margin-top: 8px;
            }
            .month-card {
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 10px;
              page-break-inside: avoid;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            }
            .month-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
              padding-bottom: 4px;
              border-bottom: 1px solid #f3f4f6;
            }
            .month-title {
              font-size: 15px;
              font-weight: 600;
              color: #1f2937;
            }
            .semester-badge {
              padding: 2px 6px;
              border-radius: 8px;
              font-size: 10px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.025em;
            }
            .semester-1 {
              background-color: #dcfce7;
              color: #166534;
            }
            .semester-2 {
              background-color: #dbeafe;
              color: #1e40af;
            }
            .subject-section {
              margin-bottom: 8px;
            }
            .subject-section:last-child {
              margin-bottom: 0;
            }
            .subject-title {
              font-weight: 600;
              color: #374151;
              font-size: 12px;
              margin-bottom: 3px;
              text-transform: uppercase;
              letter-spacing: 0.025em;
            }
            .topic-item {
              display: flex;
              align-items: flex-start;
              margin-bottom: 2px;
              font-size: 11px;
            }
            .topic-bullet {
              width: 3px;
              height: 3px;
              background-color: #3b82f6;
              border-radius: 50%;
              margin-top: 4px;
              margin-right: 6px;
              flex-shrink: 0;
            }
            .topic-content {
              flex: 1;
            }
            .topic-text {
              color: #374151;
              line-height: 1.2;
              font-weight: 400;
            }
            .chapter-text {
              color: #6b7280;
              font-size: 9px;
              margin-top: 1px;
              font-style: italic;
            }
            @media print {
              body { 
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .header {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .month-card { 
                break-inside: avoid;
                page-break-inside: avoid;
              }
              .month-grid {
                grid-template-columns: repeat(3, 1fr);
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="main-title">🎓 Sahayak Monthly Teaching Plan</div>
            <div class="subtitle">AI-Powered Multi-Grade Teaching Assistant</div>
            <div class="grade-info">Grade ${curriculum.grade} NCERT Curriculum • Generated on ${curriculum.generatedAt}</div>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generateChapterNumbers = (start, end) => {
    const chapters = [];
    for (let i = start + 1; i <= end; i++) {
      chapters.push(`Chapter ${i}`);
    }
    return chapters;
  };

  const generateCurriculum = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const grade = selectedGrade;
      const topics = DEFAULT_TOPICS[grade] || DEFAULT_TOPICS[2];
      
      const detailedCurriculum = {
        grade: grade,
        subjects: Object.keys(topics),
        generatedAt: new Date().toLocaleDateString(),
        monthlyPlan: generateMonthlyPlan(topics),
        resources: generateResourceLinks(grade, Object.keys(topics))
      };
      
      setCurriculum(detailedCurriculum);
      setLoading(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" message="Generating your detailed NCERT curriculum..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">📚 Build Your Teaching Plan, Respected Teacher</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create a comprehensive curriculum with NCERT book integration for your multi-grade classroom.
        </p>
      </div>

      {/* Grade Selection for Curriculum */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Select Grade for Curriculum</h3>
        {user?.teachingGrades && user.teachingGrades.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-3 mb-4">
              {user.teachingGrades.map(grade => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedGrade === grade 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Currently creating curriculum for: <span className="font-medium text-blue-600">Grade {selectedGrade}</span>
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">No teaching grades selected</p>
            <p className="text-sm text-gray-400">Please go back to the welcome page to select your teaching grades</p>
          </div>
        )}
      </div>

      {!curriculum ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
               onClick={() => setSelectedOption('automatic')}>
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">NCERT Curriculum</h3>
            <p className="text-gray-600 mb-6">Generate curriculum based on NCERT books for Grade {selectedGrade} with detailed monthly planning</p>
            {selectedOption === 'automatic' && (
              <Button onClick={generateCurriculum} size="large">
                🚀 Generate NCERT Curriculum
              </Button>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
               onClick={() => setSelectedOption('custom')}>
            <div className="text-4xl mb-4">✏️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Curriculum</h3>
            <p className="text-gray-600 mb-6">Build your own curriculum with selected topics and chapters</p>
            {selectedOption === 'custom' && (
              <Button onClick={generateCurriculum} size="large">
                🎯 Create Custom Plan
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  📋 Grade {curriculum.grade} NCERT Curriculum
                </h2>
                <p className="text-gray-600">Generated on {curriculum.generatedAt}</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setCurriculum(null)}
                >
                  ✨ Create New
                </Button>
              </div>
            </div>

            {/* NCERT Books & Resources */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 NCERT Books & Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {curriculum.subjects.map((subject, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">{subject}</h4>
                    <div className="flex space-x-2 mb-2">
                      <a 
                        href={curriculum.resources?.[subject]?.english}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      >
                        📖 English PDF
                      </a>
                      <a 
                        href={curriculum.resources?.[subject]?.hindi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                      >
                        📖 Hindi PDF
                      </a>
                    </div>
                    <p className="text-xs text-gray-600">
                      Click to download NCERT books • 
                      <span className="text-amber-600"> Some books may not be available</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Plan */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">📅 Monthly Teaching Plan</h3>
              <Button 
                onClick={printMonthlyPlan}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                🖨️ Print Teaching Plan
              </Button>
            </div>
            <div id="monthly-teaching-plan" className="month-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(curriculum.monthlyPlan).map(([month, plan]) => (
                <div key={month} className="month-card bg-white rounded-xl p-6 shadow-lg">
                  <div className="month-header flex items-center justify-between mb-4">
                    <h4 className="month-title text-lg font-semibold text-gray-900">{month}</h4>
                    <span className={`semester-badge px-2 py-1 rounded-full text-xs font-medium ${
                      plan.semester === 1 ? 'semester-1 bg-green-100 text-green-800' : 'semester-2 bg-blue-100 text-blue-800'
                    }`}>
                      Semester {plan.semester}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(plan.subjects).map(([subject, details]) => (
                      <div key={subject} className="subject-section">
                        <h5 className="subject-title font-medium text-gray-800 text-sm mb-2">{subject}</h5>
                        <div className="space-y-1">
                          {details.topics.map((topic, index) => (
                            <div key={index} className="topic-item flex items-start text-sm">
                              <span className="topic-bullet w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              <div className="topic-content flex-1">
                                <div className="topic-text text-gray-700">{topic}</div>
                                <div className="chapter-text text-gray-500 text-xs">{details.chapters[index]}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Dashboard component
const Dashboard = ({ aiOpen, setAiOpen, onLearnConceptClick, onPrepareLessonClick }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', title: t('dashboard.menu.dashboard'), icon: '🏠' },
    { id: 'curriculum', title: t('dashboard.menu.curriculum'), icon: '📚' },
    { id: 'learn', title: t('dashboard.menu.learn'), icon: '🧠' },
    { id: 'prepare', title: t('dashboard.menu.prepare'), icon: '📝' },
    { id: 'ai', title: t('dashboard.menu.ai'), icon: '🤖' }
  ];

  const renderContent = () => {
    if (currentView === 'curriculum') {
      return <CreateCurriculum />;
    }
    
    return (
      <div>
        <div className="mb-8">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <LanguageDropdown />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcomeBack', { name: user?.firstName || user?.name || user?.displayName || 'Teacher' })} 👋
          </h2>
          <p className="text-gray-600">
            {user?.schoolName ? t('dashboard.multiGradeTeacher', { school: user.schoolName }) : t('dashboard.multiGradeTeacher', { school: '' })}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {user?.teachingGrades?.map(grade => (
              <span key={grade} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Grade {grade}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.slice(1).map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => {
                if (item.id === 'ai') {
                  setAiOpen(true);
                } else if (item.id === 'learn') {
                  onLearnConceptClick();
                } else if (item.id === 'prepare') {
                  onPrepareLessonClick();
                } else {
                  setCurrentView(item.id);
                }
              }}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                  <p className="text-gray-600 text-sm">{t('dashboard.clickToExplore')}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Teaching Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Name:</span> Respected Teacher {user?.firstName} {user?.lastName}</div>
            <div><span className="font-medium">Teaching Grades:</span> {user?.teachingGrades?.join(', ')}</div>
            <div><span className="font-medium">School:</span> {user?.schoolName}</div>
            <div><span className="font-medium">District:</span> {user?.district}</div>
            <div><span className="font-medium">Phone:</span> {user?.phoneNumber}</div>
            <div><span className="font-medium">Classroom Type:</span> Multi-Grade Teaching</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🎓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sahayak</h1>
              <p className="text-sm text-gray-600">Multi-Grade Teaching Assistant</p>
            </div>
            
            <nav className="hidden md:flex space-x-1 ml-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'ai') {
                      setAiOpen(true);
                    } else if (item.id === 'learn') {
                      onLearnConceptClick();
                    } else if (item.id === 'prepare') {
                      onPrepareLessonClick();
                    } else {
                      setCurrentView(item.id);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon} {item.title}
                </button>
              ))}
            </nav>
          </div>
          
                      <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 font-medium"
            >
              {t('dashboard.logout')}
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 pb-8">
        {renderContent()}
      </main>
    </div>
  );
};

// Main App component
const AppContent = ({ aiOpen, setAiOpen, onLearnConceptClick, onPrepareLessonClick }) => {
  const { isAuthenticated, profileCompleted, loading, completeProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading Sahayak..." />
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // If authenticated but profile not completed, show welcome setup
  if (!profileCompleted) {
    return <WelcomeSetup onComplete={completeProfile} />;
  }

  // If authenticated and profile completed, show dashboard
  return <Dashboard aiOpen={aiOpen} setAiOpen={setAiOpen} onLearnConceptClick={onLearnConceptClick} onPrepareLessonClick={onPrepareLessonClick} />;
};

function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [learningWindowOpen, setLearningWindowOpen] = useState(false);
  const [prepareLessonOpen, setPrepareLessonOpen] = useState(false);
  
  const handleLearnConceptClick = () => {
    setLearningWindowOpen(true);
  };

  const handlePrepareLessonClick = () => {
    setPrepareLessonOpen(true);
  };
  
  return (
    <div className="App">
      <AuthProvider>
        <AppProvider>
          <AppContent 
            aiOpen={aiOpen} 
            setAiOpen={setAiOpen} 
            onLearnConceptClick={handleLearnConceptClick}
            onPrepareLessonClick={handlePrepareLessonClick}
          />
          {/* Floating AI Assistant */}
          <AIAssistantFloating open={aiOpen} setOpen={setAiOpen} />
          {/* Learning Window */}
          <LearningWindow isOpen={learningWindowOpen} onClose={() => setLearningWindowOpen(false)} />
          {/* Prepare Lesson Window */}
          <PrepareLessonWindow 
            isOpen={prepareLessonOpen} 
            onClose={() => setPrepareLessonOpen(false)}
            selectedGrades={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} // Mock grades, you can get this from user context
          />
        </AppProvider>
      </AuthProvider>
    </div>
  );
}

export default App;