export type UserRole = 'admin' | 'teacher' | 'student';
export type UserStatus = 'pending' | 'active' | 'suspended';

export interface User {
  id: string;
  username?: string; // used for teachers/admins
  name: string;
  phone: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  grade?: number; // 1 to 12 (relevant for students), or 13 for Summer Courses
  avatar?: string;
  approvedUntil?: 'unlimited' | string | null; // string is ISO date (for students)
  isTrial?: boolean; // Trial flag
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: string[]; // for multiple choice
  correctAnswer: string;
  points: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  type: 'drag-drop' | 'html';
  content: string; // JSON string of Question[] for 'drag-drop', or HTML string for 'html'
  grade: number; // 1 to 12
  visible: boolean;
  maxAttempts: number | 'unlimited';
  order: number;
  isTrial?: boolean;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  grade: number; // 1 to 12
  visible: boolean;
  maxViews: number | 'unlimited';
  order: number;
  isTrial?: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  fileUrl: string; // URL link or base64
  grade: number; // 1 to 12
  type?: 'pdf' | 'html';
  htmlContent?: string;
  isTrial?: boolean;
  createdAt: string;
}

export interface Word {
  id: string;
  word: string;
  meaning: string; // English definition
  translation: string; // Arabic meaning
  pronunciation?: string; // pronunciation spelling or audio url
  partOfSpeech?: string; // noun, verb, adj etc.
  example?: string;
  grade: number; // 1 to 12
  type?: 'word' | 'html';
  htmlContent?: string;
  isTrial?: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'student_registration';
  message: string;
  data: {
    studentId: string;
    studentName: string;
    studentPhone: string;
    grade: number;
  };
  read: boolean;
  createdAt: string;
}

export interface VideoLog {
  id: string;
  userId: string;
  videoId: string;
  viewedAt: string;
  viewCount: number;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  score: number;
  totalPoints: number;
  answers: Record<string, string>; // questionId -> studentAnswer
  solvedAt: string;
  attemptNumber: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  grade: number; // 1 to 12 (or 0 for all grades)
  type: 'review' | 'schedule' | 'honor' | 'general';
  visible: boolean;
  createdAt: string;
}

export interface AppSettings {
  mohamedSalahPicture: string;
  hagarAfifiPicture: string;
}


