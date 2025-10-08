
export enum GameState {
  Welcome = 'WELCOME',
  Loading = 'LOADING',
  Quiz = 'QUIZ',
  Results = 'RESULTS',
}

export interface Question {
  question: string;
  answer: number;
}
