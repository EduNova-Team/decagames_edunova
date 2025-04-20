// Types for question and answer data

export interface Option {
  id: string;
  label: string; // A, B, C, D
  text: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options: Option[];
  correctAnswer: string; // A, B, C, D
  explanation: string;
}

export interface Game {
  id: string;
  name: string;
  created: string;
  questions: Question[];
}

export interface GameSummary {
  id: string;
  name: string;
  created: string;
  questions: number;
}

// Types for PDF processing

export interface PDFUploadResponse {
  gameId: string;
  name: string;
  questions: Question[];
}

// Types for game state

export type GameState = "loading" | "ready" | "playing" | "results" | "review";
