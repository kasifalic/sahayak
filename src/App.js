import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DEFAULT_TOPICS, NCERT_SUBJECTS_BY_GRADE, GRADES } from './utils/constants';

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

// Multi-Grade Selection Component
const GradeSelectionModal = ({ isOpen, onClose, onSave, selectedGrades, setSelectedGrades }) => {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Select Your Teaching Grades</h2>
        <p className="text-gray-600 mb-6">Choose the grades you teach in your multi-grade classroom:</p>
        
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
          <Button 
            onClick={onSave} 
            disabled={selectedGrades.length === 0}
            size="large" 
            className="flex-1"
          >
            ✅ Save Selection
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline" 
            size="large"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Mock Login Component
const MockLogin = () => {
  const { login } = useApp();
  const [selectedGrades, setSelectedGrades] = useState([2, 8, 9]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  
  const handleMockLogin = () => {
    if (selectedGrades.length === 0) {
      setShowGradeModal(true);
      return;
    }

    const mockUser = {
      firstName: 'Priya',
      lastName: 'Sharma',
      phoneNumber: '9876543210',
      teachingGrades: selectedGrades,
      primaryGrade: selectedGrades[0],
      schoolName: 'Government Primary School',
      district: 'Rajgarh',
      state: 'Madhya Pradesh'
    };
    login(mockUser);
  };

  const handleGradeSave = () => {
    setShowGradeModal(false);
    if (selectedGrades.length > 0) {
      handleMockLogin();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🎓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Sahayak</h1>
            <p className="text-gray-600">Your Multi-Grade Teaching Assistant</p>
          </div>

          {/* Grade Selection Display */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Teaching Grades:</h3>
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
              ⚙️ Change Grade Selection
            </button>
          </div>
          
          <Button onClick={handleMockLogin} size="large" className="w-full">
            🚀 Start Teaching Journey
          </Button>
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

// Enhanced Curriculum Component for Multi-Grade
const CreateCurriculum = () => {
  const { user } = useApp();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">📚 Build Your Teaching Plan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create a comprehensive curriculum with NCERT book integration for your multi-grade classroom.
        </p>
      </div>

      {/* Grade Selection for Curriculum */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Select Grade for Curriculum</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {user?.teachingGrades?.map(grade => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedGrade === grade 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grade {grade}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Currently creating curriculum for: <span className="font-medium">Grade {selectedGrade}</span>
        </p>
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
                  onClick={() => window.print()}
                  variant="secondary"
                >
                  🖨️ Print
                </Button>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📅 Monthly Teaching Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(curriculum.monthlyPlan).map(([month, plan]) => (
                <div key={month} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{month}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.semester === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Semester {plan.semester}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(plan.subjects).map(([subject, details]) => (
                      <div key={subject}>
                        <h5 className="font-medium text-gray-800 text-sm mb-2">{subject}</h5>
                        <div className="space-y-1">
                          {details.topics.map((topic, index) => (
                            <div key={index} className="flex items-start text-sm">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              <div className="flex-1">
                                <div className="text-gray-700">{topic}</div>
                                <div className="text-gray-500 text-xs">{details.chapters[index]}</div>
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
const Dashboard = () => {
  const { user, logout } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', icon: '🏠' },
    { id: 'curriculum', title: 'Create Curriculum', icon: '📚' },
    { id: 'learn', title: 'Learn Concept', icon: '🧠' },
    { id: 'prepare', title: 'Prepare Lessons', icon: '📝' },
    { id: 'ai', title: 'AI Assistant', icon: '🤖' }
  ];

  const renderContent = () => {
    if (currentView === 'curriculum') {
      return <CreateCurriculum />;
    }
    
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-gray-600">
            Multi-Grade Teacher at {user?.schoolName}
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
              onClick={() => setCurrentView(item.id)}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">Click to explore this feature</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Multi-Grade Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}</div>
            <div><span className="font-medium">Teaching Grades:</span> {user?.teachingGrades?.join(', ')}</div>
            <div><span className="font-medium">School:</span> {user?.schoolName}</div>
            <div><span className="font-medium">District:</span> {user?.district}</div>
            <div><span className="font-medium">Phone:</span> {user?.phoneNumber}</div>
            <div><span className="font-medium">Classroom Type:</span> Multi-Grade</div>
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
                  onClick={() => setCurrentView(item.id)}
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
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

// Main App component
const AppContent = () => {
  const { isAuthenticated, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading Sahayak..." />
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <MockLogin />;
};

function App() {
  return (
    <div className="App">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </div>
  );
}

export default App;