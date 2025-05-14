import React, { createContext, useContext, useState } from 'react';
import { InterviewState } from '../types/interview';
import { Profession, Position } from '../data/professions';
import { Question, Feedback, generateQuestions, generateFeedback } from '../services/interviewService';

// Interview Context için başlangıç durumu
const initialState: InterviewState = {
  selectedProfession: null,
  selectedPosition: null,
  customProfession: null,
  customPosition: null,
  questions: [],
  answers: [],
  feedback: null,
  currentStep: 'selection',
};

// Context tanımı
interface InterviewContextType {
  state: InterviewState;
  setProfession: (profession: Profession | null) => void;
  setPosition: (position: Position | null) => void;
  setCustomProfession: (professionName: string) => void;
  setCustomPosition: (positionName: string) => void;
  generateInterviewQuestions: () => void;
  setAnswer: (questionIndex: number, answer: string) => void;
  submitAnswers: () => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

// Context Provider
export const InterviewProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<InterviewState>(initialState);

  // Meslek seçimi
  const setProfession = (profession: Profession | null) => {
    setState(prev => ({
      ...prev,
      selectedProfession: profession,
      customProfession: profession ? null : prev.customProfession,
      selectedPosition: null,
      customPosition: null,
    }));
  };

  // Özel meslek ekleme
  const setCustomProfession = (professionName: string) => {
    setState(prev => ({
      ...prev,
      selectedProfession: null,
      customProfession: professionName,
      selectedPosition: null,
      customPosition: null,
    }));
  };

  // Pozisyon seçimi
  const setPosition = (position: Position | null) => {
    setState(prev => ({
      ...prev,
      selectedPosition: position,
      customPosition: position ? null : prev.customPosition,
    }));
  };

  // Özel pozisyon ekleme
  const setCustomPosition = (positionName: string) => {
    setState(prev => ({
      ...prev,
      selectedPosition: null,
      customPosition: positionName,
    }));
  };

  // Soruları oluştur
  const generateInterviewQuestions = () => {
    if ((!state.selectedProfession && !state.customProfession) || 
        (!state.selectedPosition && !state.customPosition)) {
      return;
    }

    // Özel meslek veya pozisyon seçilmişse, onlar için rastgele ID oluştur
    const professionId = state.selectedProfession ? 
      state.selectedProfession.id : 
      `custom-${state.customProfession?.toLowerCase().replace(/\s+/g, '-')}`;
    
    const positionId = state.selectedPosition ? 
      state.selectedPosition.id : 
      `custom-${state.customPosition?.toLowerCase().replace(/\s+/g, '-')}`;

    const questions = generateQuestions(professionId, positionId);

    setState(prev => ({
      ...prev,
      questions,
      answers: questions.map(() => ''),
      currentStep: 'questions',
    }));
  };

  // Cevap belirleme
  const setAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...state.answers];
    newAnswers[questionIndex] = answer;

    setState(prev => ({
      ...prev,
      answers: newAnswers,
    }));
  };

  // Cevapları gönder ve geri bildirim al
  const submitAnswers = () => {
    if ((!state.selectedProfession && !state.customProfession) || 
        (!state.selectedPosition && !state.customPosition)) {
      return;
    }

    // Özel meslek veya pozisyon seçilmişse, onlar için rastgele ID oluştur
    const professionId = state.selectedProfession ? 
      state.selectedProfession.id : 
      `custom-${state.customProfession?.toLowerCase().replace(/\s+/g, '-')}`;
    
    const positionId = state.selectedPosition ? 
      state.selectedPosition.id : 
      `custom-${state.customPosition?.toLowerCase().replace(/\s+/g, '-')}`;

    const feedback = generateFeedback(
      professionId,
      positionId,
      state.questions,
      state.answers
    );

    setState(prev => ({
      ...prev,
      feedback,
      currentStep: 'feedback',
    }));
  };

  // Sıfırla
  const resetInterview = () => {
    setState(initialState);
  };

  return (
    <InterviewContext.Provider
      value={{
        state,
        setProfession,
        setPosition,
        setCustomProfession,
        setCustomPosition,
        generateInterviewQuestions,
        setAnswer,
        submitAnswers,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

// Hook kullanımı
export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}; 