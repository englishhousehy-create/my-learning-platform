import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import { User } from './types';
import { GraduationCap } from 'lucide-react';
import { Language } from './translations';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('english_portal_lang') as Language) || 'en';
  });

  useEffect(() => {
    // Check if session exists in localStorage
    const cached = localStorage.getItem('english_portal_user');
    if (cached) {
      try {
        setCurrentUser(JSON.parse(cached));
      } catch (err) {
        console.error('Failed to parse cached session:', err);
      }
    }
    setCheckingSession(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('english_portal_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('english_portal_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('english_portal_user');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 mx-auto animate-spin">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm text-slate-500 font-semibold">Booting portal...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} lang={lang} setLang={setLang} />;
  }

  // Route to the appropriate dashboard
  if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
    return <TeacherDashboard user={currentUser} onLogout={handleLogout} lang={lang} setLang={setLang} />;
  }

  return <StudentDashboard student={currentUser} onLogout={handleLogout} lang={lang} setLang={setLang} />;
}
