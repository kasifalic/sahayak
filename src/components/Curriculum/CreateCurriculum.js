import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GRADES, DEFAULT_TOPICS } from '../../utils/constants';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

const CreateCurriculum = () => {
  const { user, setLoading, loading } = useApp();
  const [selectedOption, setSelectedOption] = useState('');
  const [customGrade, setCustomGrade] = useState(user?.gradeTeaching || '');
  const [customTopics, setCustomTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [generatedCurriculum, setGeneratedCurriculum] = useState(null);

  const curriculumOptions = [
    {
      id: 'automatic',
      title: 'Create Automatic Curriculum',
      description: 'Generate a complete year-long curriculum based on your grade level',
      icon: '🤖',
      color: 'bg-primary-500',
      features: ['AI-Generated', 'Grade-Specific', 'Month-wise Planning', 'Subject Integration']
    },
    {
      id: 'custom',
      title: 'Customize Curriculum',
      description: 'Build your own curriculum by selecting specific topics and subjects',
      icon: '✏️',
      color: 'bg-secondary-500',
      features: ['Flexible Topics', 'Custom Timeline', 'Subject Selection', 'Personal Touch']
    }
  ];

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setGeneratedCurriculum(null);
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !customTopics.includes(newTopic.trim())) {
      setCustomTopics([...customTopics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setCustomTopics(customTopics.filter(topic => topic !== topicToRemove));
  };

  const generateAutomaticCurriculum = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const grade = parseInt(user?.gradeTeaching || customGrade);
      const topics = DEFAULT_TOPICS[grade] || DEFAULT_TOPICS[1];
      
      const curriculum = {
        grade: grade,
        type: 'automatic',
        generatedAt: new Date().toISOString(),
        subjects: Object.keys(topics),
        monthlyPlan: generateMonthlyPlan(topics)
      };
      
      setGeneratedCurriculum(curriculum);
      
    } catch (error) {
      console.error('Failed to generate curriculum');
    } finally {
      setLoading(false);
    }
  };

  const generateCustomCurriculum = async () => {
    if (customTopics.length === 0) {
      alert('Please add at least one topic');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const curriculum = {
        grade: parseInt(customGrade),
        type: 'custom',
        generatedAt: new Date().toISOString(),
        topics: customTopics,
        monthlyPlan: generateCustomMonthlyPlan(customTopics)
      };
      
      setGeneratedCurriculum(curriculum);
      
    } catch (error) {
      console.error('Failed to create curriculum');
    } finally {
      setLoading(false);
    }
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
        
        monthlyPlan[month].subjects[subject] = subjectTopics.slice(startIndex, endIndex);
      });
    });
    
    return monthlyPlan;
  };

  const generateCustomMonthlyPlan = (topics) => {
    const months = [
      'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December', 'January', 'February', 'March'
    ];
    
    const monthlyPlan = {};
    const topicsPerMonth = Math.ceil(topics.length / 12);
    
    months.forEach((month, index) => {
      const startIndex = index * topicsPerMonth;
      const endIndex = Math.min(startIndex + topicsPerMonth, topics.length);
      
      monthlyPlan[month] = {
        semester: index < 6 ? 1 : 2,
        topics: topics.slice(startIndex, endIndex)
      };
    });
    
    return monthlyPlan;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" message="Generating your curriculum..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">📚 Build Your Teaching Plan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create a comprehensive curriculum tailored to your classroom needs. Choose between 
          AI-generated content or build your own custom plan.
        </p>
      </div>

      {!generatedCurriculum ? (
        <>
          {/* Curriculum Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {curriculumOptions.map((option, index) => {
              const isSelected = selectedOption === option.id;
              
              return (
                <div
                  key={option.id}
                  className={`bg-white rounded-xl p-6 shadow-lg cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-primary-500 shadow-xl' : 'hover:shadow-xl'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {option.icon}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {option.description}
                  </p>
                  
                  <div className="space-y-2">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Configuration Section */}
          {selectedOption && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              {selectedOption === 'automatic' ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Generate Automatic Curriculum
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Generate curriculum for Grade {user?.gradeTeaching} (Class {user?.gradeTeaching})?
                  </p>
                  <Button onClick={generateAutomaticCurriculum} size="large">
                    🚀 Generate Curriculum
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Customize Your Curriculum
                  </h3>
                  
                  {/* Grade Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      value={customGrade}
                      onChange={(e) => setCustomGrade(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Grade</option>
                      {GRADES.map(grade => (
                        <option key={grade.value} value={grade.value}>
                          {grade.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Topic Addition */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Topics
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Enter topic name"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                      />
                      <Button onClick={handleAddTopic} size="medium">
                        ➕ Add
                      </Button>
                    </div>
                  </div>

                  {/* Topics List */}
                  {customTopics.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {customTopics.map((topic, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                          >
                            {topic}
                            <button
                              onClick={() => handleRemoveTopic(topic)}
                              className="ml-2 text-primary-600 hover:text-primary-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={generateCustomCurriculum} 
                    size="large"
                    disabled={!customGrade || customTopics.length === 0}
                  >
                    🎯 Generate Custom Curriculum
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Generated Curriculum Display */
        <div className="space-y-6">
          {/* Curriculum Header */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  📋 Grade {generatedCurriculum.grade} Curriculum
                </h2>
                <p className="text-gray-600">
                  Generated on {new Date(generatedCurriculum.generatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handlePrint} variant="outline">
                  🖨️ Print
                </Button>
                <Button onClick={() => setGeneratedCurriculum(null)} variant="outline">
                  ✨ Create New
                </Button>
              </div>
            </div>

            {generatedCurriculum.subjects && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Subjects Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedCurriculum.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Monthly Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(generatedCurriculum.monthlyPlan).map(([month, plan]) => (
              <div key={month} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{month}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.semester === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Semester {plan.semester}
                  </span>
                </div>
                
                {plan.subjects ? (
                  <div className="space-y-3">
                    {Object.entries(plan.subjects).map(([subject, topics]) => (
                      <div key={subject}>
                        <h4 className="font-medium text-gray-800 text-sm">{subject}</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {topics.map((topic, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plan.topics?.map((topic, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCurriculum;