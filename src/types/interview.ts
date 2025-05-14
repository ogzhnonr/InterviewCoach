import { Question, Feedback } from '../services/interviewService';
import { Profession, Position } from '../data/professions';

export interface InterviewState {
  selectedProfession: Profession | null;
  selectedPosition: Position | null;
  customProfession: string | null;
  customPosition: string | null;
  questions: Question[];
  answers: string[];
  feedback: Feedback | null;
  currentStep: 'selection' | 'questions' | 'feedback';
} 