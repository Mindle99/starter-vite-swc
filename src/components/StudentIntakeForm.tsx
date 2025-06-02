import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, User, Users, GraduationCap, Target, Clock, Heart } from 'lucide-react';
import { createStudent } from '@/lib/supabaseApi';

const StudentIntakeForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Student Basic Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    school: '',
    phone: '',
    email: '',
    preferredName: '',
    // Parent/Guardian Info
    primaryParentName: '',
    primaryParentPhone: '',
    primaryParentEmail: '',
    relationship1: 'Mother',
    secondaryParentName: '',
    secondaryParentPhone: '',
    secondaryParentEmail: '',
    relationship2: 'Father',
    emergencyContact: '',
    emergencyPhone: '',
    // Academic Information
    currentGPA: '',
    subjects: [],
    learningStyle: '',
    academicGoals: '',
    challengeAreas: '',
    strengths: '',
    // Special Needs & Accommodations
    hasIEP: false,
    has504: false,
    learningDifferences: '',
    accommodations: '',
    medicalConsiderations: '',
    // Previous Tutoring Experience
    hadTutoring: '',
    previousSubjects: '',
    whatWorked: '',
    whatDidntWork: '',
    preferredTutoringStyle: '',
    // Support & Goals
    primaryGoals: '',
    parentExpectations: '',
    studentMotivation: '',
    availableHours: '',
    preferredSchedule: '',
    communicationPreference: 'Email'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const totalSteps = 6;

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subject) => {
    const updatedSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    updateFormData('subjects', updatedSubjects);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
    const { error } = await createStudent(formData);
    setSubmitting(false);
    if (error) {
      setSubmitMessage('Failed to add student: ' + error.message);
    } else {
      setSubmitMessage('Student added successfully!');
    }
  };

  const stepIcons = {
    1: User,
    2: Users,
    3: GraduationCap,
    4: Target,
    5: Clock,
    6: Heart
  };

  const stepTitles = {
    1: "Student Information",
    2: "Parent/Guardian Details", 
    3: "Academic Background",
    4: "Special Needs & Support",
    5: "Previous Experience",
    6: "Goals & Preferences"
  };

  const getCurrentStepIcon = () => {
    const IconComponent = stepIcons[currentStep];
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Progress Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getCurrentStepIcon()}
            <h2 className="text-xl font-semibold text-gray-800">
              {stepTitles[currentStep]}
            </h2>
          </div>
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6">
        {/* ... form steps as in your provided code ... */}
        {/* (Omitted for brevity, but all your step content goes here) */}
      </div>

      {/* Submission Message */}
      {submitMessage && (
        <div className={`px-6 pb-2 text-sm ${submitMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{submitMessage}</div>
      )}

      {/* Navigation Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1 || submitting}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentStep === totalSteps ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
          >
            <span>{submitting ? 'Adding...' : 'Add Student'}</span>
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={submitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentIntakeForm; 