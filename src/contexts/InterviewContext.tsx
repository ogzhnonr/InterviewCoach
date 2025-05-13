import React, { createContext, useContext, useState } from 'react';
import { InterviewState } from '../types/interview';
import { Profession, Position } from '../data/professions';
import { Question, Feedback, generateQuestions, generateFeedback } from '../services/interviewService';

// Interview Context için başlangıç durumu
const initialState: InterviewState = {
  selectedProfession: null,
  selectedPosition: null,
  questions: [],
  answers: [],
  feedback: null,
  currentStep: 'selection',
};

// Context tanımı
interface InterviewContextType {
  state: InterviewState;
  setProfession: (profession: Profession) => void;
  setPosition: (position: Position) => void;
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
  const setProfession = (profession: Profession) => {
    setState(prev => ({
      ...prev,
      selectedProfession: profession,
      selectedPosition: null,
    }));
  };

  // Pozisyon seçimi
  const setPosition = (position: Position) => {
    setState(prev => ({
      ...prev,
      selectedPosition: position,
    }));
  };

  // Soruları oluştur
  const generateInterviewQuestions = () => {
    if (!state.selectedProfession || !state.selectedPosition) {
      return;
    }

    const questions = generateQuestions(
      state.selectedProfession.id,
      state.selectedPosition.id
    );

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
    if (!state.selectedProfession || !state.selectedPosition) {
      return;
    }

    const feedback = generateFeedback(
      state.selectedProfession.id,
      state.selectedPosition.id,
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