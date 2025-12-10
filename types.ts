export enum UserMode {
  STUDENT = 'Estudiante',
  DAILY_LIFE = 'Vida Diaria'
}

export enum CatAccessory {
  NONE = 'Ninguno',
  GLASSES = 'Gafas',
  BOW_TIE = 'Corbatín',
  HAT = 'Sombrero'
}

export interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  category: 'academic' | 'personal' | 'chore';
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserState {
  name: string;
  mode: UserMode | null;
  points: number;
  accessory: CatAccessory;
  tasks: Task[];
  habits: Habit[];
  chatHistory: ChatMessage[];
  onboarded: boolean;
}
