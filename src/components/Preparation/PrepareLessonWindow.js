import React, { useState, useEffect } from 'react';
import { X, BookOpen, FileText, Download, ExternalLink } from 'lucide-react';
import NewtonImage from '../../newtonlawofmotion.jpg';

const SUBJECTS = [
  { id: 'physics', name: 'Physics', topics: ['Newton\'s Law of Motion', 'Gravity', 'Electricity', 'Magnetism', 'Light'] },
  { id: 'biology', name: 'Biology', topics: ['Cell Structure', 'Human Body', 'Plants', 'Animals', 'Ecosystem'] },
  { id: 'information-technology', name: 'Information Technology', topics: ['Computer Basics', 'Programming', 'Internet', 'Digital Safety', 'Software'] },
  { id: 'science', name: 'Science', topics: ['Scientific Method', 'Matter', 'Energy', 'Environment', 'Technology'] },
  { id: 'maths', name: 'Mathematics', topics: ['Algebra', 'Geometry', 'Arithmetic', 'Statistics', 'Calculus'] }
];

const NEWTON_STUDY_MATERIAL = {
  title: "Newton's Law of Motion",
  grade: "Grade 9-12",
  subject: "Physics",
  pageNumber: "Page 45-52",
  textbookLink: "/assets/ncert-books/grade-11-physics-en.pdf",
  
  content: `**Newton's Law of Motion - Complete Study Material**

**Respected Teacher, here's your comprehensive study material to teach Newton's Law of Motion:**

## 📖 Textbook Reference
- **Page Numbers:** Page 45-52
- **Textbook:** NCERT Physics Textbook
- **Download:** [Click here to download the textbook](/assets/ncert-books/grade-11-physics-en.pdf)

## 🎯 Learning Objectives
By the end of this lesson, students should be able to:
- Understand the three laws of motion
- Apply these laws to real-world situations
- Explain the concept of inertia
- Demonstrate understanding through examples

## 📚 Detailed Content

### **Newton's First Law (Law of Inertia)**
**Definition:** An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.

**How to teach this to students:**
1. **Start with a demonstration:** Place a book on the desk and ask students why it doesn't move
2. **Use everyday examples:** 
   - A car stopping suddenly (passengers lean forward)
   - A ball rolling on the ground (eventually stops due to friction)
   - A spaceship in space (continues moving forever)

### **Newton's Second Law (Force and Acceleration)**
**Definition:** Force equals mass times acceleration (F = ma)

**Teaching approach:**
1. **Visual demonstration:** Show how pushing a light object vs. heavy object requires different force
2. **Mathematical connection:** Introduce the formula with simple calculations
3. **Real examples:** 
   - Pushing a shopping cart (more items = more force needed)
   - Car acceleration (more force = faster acceleration)

### **Newton's Third Law (Action and Reaction)**
**Definition:** For every action, there is an equal and opposite reaction.

**Classroom activities:**
1. **Balloon rocket:** Blow up a balloon and let it go
2. **Rowing a boat:** Explain how pushing water backward moves the boat forward
3. **Walking:** Explain how pushing the ground backward moves us forward

## 🖼️ Visual Aid
![Newton's Law of Motion](${NewtonImage})

## 📋 Teaching Plan (45 minutes)

### **Introduction (10 minutes)**
- Ask students about their experiences with moving objects
- Introduce Sir Isaac Newton and his contributions
- Show the image and explain what we'll learn

### **Main Content (25 minutes)**
- **First Law (8 minutes):** Demonstrate with classroom objects
- **Second Law (10 minutes):** Use mathematical examples
- **Third Law (7 minutes):** Interactive demonstrations

### **Conclusion (10 minutes)**
- Review key concepts
- Assign homework problems
- Answer student questions

## 🎮 Interactive Activities

### **Activity 1: Inertia Demonstration**
**Materials:** Coin, index card, glass
**Procedure:** Place coin on card over glass, quickly pull card away
**Learning:** Demonstrates inertia - coin stays in place

### **Activity 2: Force and Motion**
**Materials:** Toy cars of different weights
**Procedure:** Push cars with same force, observe different accelerations
**Learning:** Heavier objects need more force for same acceleration

### **Activity 3: Action-Reaction Pairs**
**Materials:** Balloons, string
**Procedure:** Inflate balloon, release to see rocket effect
**Learning:** Air pushing backward moves balloon forward

## 📝 Assessment Questions

### **Beginner Level:**
1. What happens to a ball when you stop pushing it?
2. Why do you lean forward when a car stops suddenly?

### **Intermediate Level:**
3. If you push a 2kg object with 10N force, what's its acceleration?
4. Give three examples of action-reaction pairs.

### **Advanced Level:**
5. Explain how Newton's laws apply to rocket propulsion.
6. Calculate the force needed to accelerate a 1000kg car at 2 m/s².

## 🔗 Additional Resources
- **Video Links:** Educational videos on Newton's laws
- **Interactive Simulations:** Online physics simulations
- **Worksheets:** Practice problems and activities

## 💡 Teaching Tips
1. **Start simple:** Use everyday examples students can relate to
2. **Be interactive:** Include hands-on demonstrations
3. **Connect to real life:** Show how these laws apply in daily situations
4. **Use visual aids:** Diagrams, videos, and the provided image
5. **Encourage questions:** Create an open learning environment

## 🎯 For Further Simplification
If you need to simplify this topic further for your students, you can:
- **Click on "Learn Concept"** for step-by-step teaching guidance
- **Ask the AI Assistant** for additional explanations and examples

**Respected Teacher, this material is designed to help you deliver an engaging and comprehensive lesson on Newton's Law of Motion. Feel free to adapt it to your classroom needs!**`};

const PrepareLessonWindow = ({ isOpen, onClose, selectedGrades }) => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showStudyMaterial, setShowStudyMaterial] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedGrade('');
      setSelectedSubject('');
      setSelectedTopic('');
      setShowStudyMaterial(false);
    }
  }, [isOpen]);

  const handleGenerateMaterial = () => {
    if (selectedGrade && selectedSubject && selectedTopic) {
      setShowStudyMaterial(true);
    }
  };

  const handleClose = () => {
    onClose();
    setShowStudyMaterial(false);
  };

  const getAvailableTopics = () => {
    const subject = SUBJECTS.find(s => s.id === selectedSubject);
    return subject ? subject.topics : [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Prepare Lesson</h2>
              <p className="text-green-100 text-sm">Create detailed study material for your students</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showStudyMaterial ? (
            /* Selection Form */
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Select Your Lesson Details, Respected Teacher
                </h3>
                <p className="text-gray-600">
                  Choose the grade, subject, and topic to generate comprehensive study material
                </p>
              </div>

              {/* Grade Selection */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📚 Select Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose a grade</option>
                  {selectedGrades?.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📖 Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedTopic('');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={!selectedGrade}
                >
                  <option value="">Choose a subject</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              {/* Topic Selection */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📝 Select Topic/Chapter
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={!selectedSubject}
                >
                  <option value="">Choose a topic</option>
                  {getAvailableTopics().map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <button
                  onClick={handleGenerateMaterial}
                  disabled={!selectedGrade || !selectedSubject || !selectedTopic}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
                >
                  <FileText size={20} />
                  <span>Generate Study Material</span>
                </button>
              </div>
            </div>
          ) : (
            /* Study Material Display */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <div className="prose prose-lg max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: NEWTON_STUDY_MATERIAL.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>')
                        .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h2>')
                        .replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n\n/g, '<br><br>')
                        .replace(/!\[Newton's Law of Motion\]\(.*?\)/g, '') // Remove the image placeholder from content
                    }} 
                  />
                  
                  {/* Add the image directly */}
                  <div className="mt-6 mb-6 text-center">
                    <img 
                      src={NewtonImage} 
                      alt="Newton's Law of Motion" 
                      className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                      style={{ maxHeight: '300px' }}
                    />
                    <p className="text-sm text-gray-600 mt-2">Newton's Law of Motion - Visual Aid for Teaching</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Download size={18} />
                    <span>Download PDF</span>
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <ExternalLink size={18} />
                    <span>Open Textbook</span>
                  </button>
                  <button 
                    onClick={() => setShowStudyMaterial(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Create New Lesson
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrepareLessonWindow; 