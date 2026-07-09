import React, { useState, useEffect } from 'react';
import { 
  Play, BookOpen, FileText, Languages, LogOut, Video, Award, Clock, 
  ChevronRight, ArrowLeft, Volume2, Download, CheckCircle, XCircle, RefreshCw, Eye, Megaphone
} from 'lucide-react';
import { User, Video as VideoType, Test as TestType, Book, Word, TestAttempt, Announcement, AppSettings } from '../types';
import { Language, translations } from '../translations';

interface StudentDashboardProps {
  student: User;
  onLogout: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function StudentDashboard({ student, onLogout, lang, setLang }: StudentDashboardProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'videos' | 'tests' | 'books' | 'words' | 'grades'>('videos');
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [tests, setTests] = useState<TestType[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [viewLogs, setViewLogs] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Active playing video / solving test
  const [activeVideo, setActiveVideo] = useState<VideoType | null>(null);
  const [activeTest, setActiveTest] = useState<TestType | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<{ score: number; total: number } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeHtmlBook, setActiveHtmlBook] = useState<Book | null>(null);
  const [activeHtmlWord, setActiveHtmlWord] = useState<Word | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    mohamedSalahPicture: '/src/assets/images/mohamed_salah_avatar_1783203726731.jpg',
    hagarAfifiPicture: '/src/assets/images/hagar_afifi_avatar_1783203738368.jpg'
  });

  // Active stage supervisor details
  const isPrimary = student.grade !== undefined && student.grade >= 1 && student.grade <= 6;
  const supervisorName = isPrimary ? t.hagarAfifi : t.mohamedSalah;
  const supervisorAvatar = isPrimary 
    ? settings.hagarAfifiPicture
    : settings.mohamedSalahPicture;
  const supervisorRole = isPrimary ? t.teachingPrim : t.teachingPrepSec;

  // Load Grade-Specific Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [vRes, tRes, bRes, wRes, lRes, annRes, setRes] = await Promise.all([
        fetch('/api/videos'),
        fetch('/api/tests'),
        fetch('/api/books'),
        fetch('/api/words'),
        fetch('/api/logs'),
        fetch('/api/announcements'),
        fetch('/api/settings')
      ]);

      const vData = await vRes.json();
      const tData = await tRes.json();
      const bData = await bRes.json();
      const wData = await wRes.json();
      const lData = await lRes.json();
      const annData = await annRes.json();
      const setData = await setRes.json();

      if (setData && setData.settings) {
        setSettings(setData.settings);
      }

      // Filter data by student grade, visibility, and trial status
      const isGradeMatch = (itemGrade: any) => {
        if (itemGrade === undefined || itemGrade === null || student.grade === undefined || student.grade === null) {
          return false;
        }
        return String(itemGrade).trim().toLowerCase() === String(student.grade).trim().toLowerCase();
      };

      const filteredVideos = (vData.videos || []).filter(
        (v: VideoType) => isGradeMatch(v.grade) && v.visible && (!v.isTrial || student.isTrial)
      );
      const filteredTests = (tData.tests || []).filter(
        (t: TestType) => isGradeMatch(t.grade) && t.visible && (!t.isTrial || student.isTrial)
      );
      const filteredBooks = (bData.books || []).filter(
        (b: Book) => isGradeMatch(b.grade) && (!b.isTrial || student.isTrial)
      );
      const filteredWords = (wData.words || []).filter(
        (w: Word) => isGradeMatch(w.grade) && (!w.isTrial || student.isTrial)
      );

      // Filter announcements: visible and matches student's grade (or 0 for all grades)
      const filteredAnnouncements = (annData.announcements || []).filter(
        (ann: Announcement) => ann.visible && (Number(ann.grade) === 0 || isGradeMatch(ann.grade))
      );

      // User attempts & view counts
      const userAttempts = (lData.testAttempts || []).filter(
        (a: TestAttempt) => a.userId === student.id
      );
      const userViews = (lData.studentLogs || []).filter(
        (l: any) => l.userId === student.id
      );

      setVideos(filteredVideos);
      setTests(filteredTests);
      setBooks(filteredBooks);
      setWords(filteredWords);
      setAnnouncements(filteredAnnouncements);
      setAttempts(userAttempts);
      setViewLogs(userViews);
    } catch (err) {
      console.error(err);
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [student.grade]);

  // Handle postMessage submission from HTML tests
  useEffect(() => {
    const handleHtmlMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'html-test-submission') {
        const { score, totalPoints, answers } = event.data;
        submitTestAnswers(activeTest!.id, score, totalPoints, answers);
      }
    };

    window.addEventListener('message', handleHtmlMessage);
    return () => window.removeEventListener('message', handleHtmlMessage);
  }, [activeTest]);

  // Track Video View Count
  const handleWatchVideo = async (video: VideoType) => {
    const currentViews = viewLogs.find(l => l.videoId === video.id)?.viewCount || 0;
    if (video.maxViews !== 'unlimited' && currentViews >= Number(video.maxViews)) {
      alert(`You have reached the maximum view limit of ${video.maxViews} times for this video.`);
      return;
    }

    try {
      const res = await fetch(`/api/videos/${video.id}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: student.id })
      });
      if (res.ok) {
        setActiveVideo(video);
        // Refresh logs
        loadData();
      } else {
        const d = await res.json();
        alert(d.error || 'Could not watch video.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit drag & drop/standard auto-correct test
  const handleSolveTestSubmit = () => {
    if (!activeTest) return;
    const questions = JSON.parse(activeTest.content);
    let score = 0;
    let totalPoints = 0;

    questions.forEach((q: any) => {
      totalPoints += q.points || 5;
      const studentAns = (testAnswers[q.id] || '').trim().toLowerCase();
      const correctAns = (q.correctAnswer || '').trim().toLowerCase();
      
      if (studentAns === correctAns) {
        score += q.points || 5;
      }
    });

    submitTestAnswers(activeTest.id, score, totalPoints, testAnswers);
  };

  const submitTestAnswers = async (testId: string, score: number, totalPoints: number, answers: any) => {
    try {
      const res = await fetch(`/api/tests/${testId}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: student.id,
          score,
          totalPoints,
          answers
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to submit test.');
      } else {
        setTestResult({ score, total: totalPoints });
        loadData();
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting score.');
    }
  };

  // Pronounce vocal list using browser synthesis
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  const formatApprovedUntil = () => {
    if (student.approvedUntil === 'unlimited') return t.unlimitedViews;
    if (!student.approvedUntil) return t.pendingStatus;
    const d = new Date(student.approvedUntil);
    return lang === 'ar' ? `مفعّل حتى ${d.toLocaleDateString()}` : `Approved until ${d.toLocaleDateString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      
      {/* Sleek Top Header Panel - Cohesive with Admin / Teacher portal */}
      <header className="bg-slate-900 border-b border-slate-800 text-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={student.avatar} 
              alt="Avatar" 
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 shadow-md animate-fade-in"
            />
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">{student.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-500/30">
                  {lang === 'ar' ? `الصف ${student.grade}` : `Grade ${student.grade}`}
                </span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 border border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {formatApprovedUntil()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Lang Selection */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  lang === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                عربي
              </button>
            </div>

            <button
              onClick={loadData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer border border-slate-700"
              title={t.refreshData}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-950/20 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t.signOut}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-8">

        {/* Welcome & Supervisor Showcase Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-premium-gradient rounded-3xl p-6 text-white shadow-xl shadow-blue-900/10 hover-glow relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10 space-y-2">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                {lang === 'ar' ? 'نظام الدراسة الذكي' : 'Smart Study System'}
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight">
                {t.welcomeBack}, <span className="underline decoration-wavy decoration-amber-400">{student.name}</span>!
              </h2>
              <p className="text-xs text-blue-100 max-w-md font-medium leading-relaxed">
                {lang === 'ar' 
                  ? 'استمتع بدراسة المنهج الدراسي من خلال فيديوهات الشرح والكتب التفاعلية وحل الاختبارات الذكية المصممة لصفك.'
                  : 'Master your English curriculum with lessons videos, interactive booklets, and smart tests graded instantly.'}
              </p>
            </div>
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-premium flex flex-col sm:flex-row items-center gap-6 hover-glow transition relative overflow-hidden">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full blur-md opacity-25 scale-105" />
              <img 
                src={supervisorAvatar} 
                alt={supervisorName} 
                className="relative w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-xl shrink-0 transition-transform duration-300 hover:scale-105 bg-slate-50"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2 text-center sm:text-start" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-blue-100 tracking-wider">
                {t.activeSupervisor}
              </span>
              <h3 className="font-extrabold text-slate-800 text-base md:text-lg leading-tight mt-1">{supervisorName}</h3>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                {supervisorRole}
              </p>
            </div>
          </div>
        </div>

        {/* Active Announcements Section (Targeted & Professional) */}
        {announcements.length > 0 && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs md:text-sm uppercase tracking-wider px-1" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <Megaphone className="w-4 h-4 text-rose-500 animate-bounce" />
              <span>{lang === 'ar' ? 'التنويهات والإعلانات الهامة' : 'Important Alerts & Announcements'}</span>
              <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {announcements.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((ann) => {
                let cardStyle = 'bg-blue-50/70 border-blue-100 text-blue-900';
                let iconText = '📢';
                let badgeLabel = t.generalType;
                let badgeStyle = 'bg-blue-100 text-blue-800 border-blue-200';

                if (ann.type === 'review') {
                  cardStyle = 'bg-indigo-50/70 border-indigo-100 text-indigo-900';
                  iconText = '📚';
                  badgeLabel = t.reviewType;
                  badgeStyle = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                } else if (ann.type === 'schedule') {
                  cardStyle = 'bg-amber-50/70 border-amber-100 text-amber-900';
                  iconText = '⏰';
                  badgeLabel = t.scheduleType;
                  badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200';
                } else if (ann.type === 'honor') {
                  cardStyle = 'bg-emerald-50/70 border-emerald-100 text-emerald-950';
                  iconText = '🏆';
                  badgeLabel = t.honorType;
                  badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                }

                return (
                  <div 
                    key={ann.id} 
                    className={`p-5 rounded-3xl border ${cardStyle} relative overflow-hidden shadow-sm hover:shadow-md transition duration-300 animate-in fade-in slide-in-from-top-4`}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {/* Background Light Pattern */}
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none select-none text-7xl font-bold translate-x-4 -translate-y-4">
                      {iconText}
                    </div>

                    <div className="flex items-start gap-3.5 relative z-10">
                      <div className="text-2xl shrink-0 p-2.5 bg-white/80 rounded-2xl shadow-sm border border-white/60">
                        {iconText}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border tracking-wide ${badgeStyle}`}>
                            {badgeLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(ann.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                              month: 'short', day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">
                          {ann.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {ann.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex overflow-x-auto gap-1 bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/50 scrollbar-hide">
          {[
            { id: 'videos', label: t.lessonsVideos, icon: Video },
            { id: 'tests', label: t.interactiveTests, icon: FileText },
            { id: 'books', label: t.booksWorkbooks, icon: BookOpen },
            { id: 'words', label: t.vocabularySpelling, icon: Languages },
            { id: 'grades', label: t.solvedLogs, icon: Award }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setActiveVideo(null);
                  setActiveTest(null);
                  setTestResult(null);
                  setTestAnswers({});
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-display font-bold text-xs shrink-0 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm min-h-[400px]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-semibold">{lang === 'ar' ? 'جاري تحميل الموارد المدرسية...' : 'Loading portal resources...'}</p>
            </div>
          )}

          {!loading && (
            <>
              {/* --- 1. VIDEOS TAB --- */}
              {activeTab === 'videos' && !activeVideo && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 mb-1">{t.lessonsVideos}</h2>
                  <p className="text-sm text-slate-500 mb-6">
                    {lang === 'ar' ? `فيديوهات الشرح والدروس المتاحة للصف ${student.grade}` : `Video lessons and classes uploaded for Grade ${student.grade}.`}
                  </p>
                  
                  {videos.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">{t.noVideos}</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videos.map((vid) => {
                        const viewCount = viewLogs.find(l => l.videoId === vid.id)?.viewCount || 0;
                        const isLocked = vid.maxViews !== 'unlimited' && viewCount >= Number(vid.maxViews);
                        
                        return (
                          <div key={vid.id} className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col justify-between">
                            <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                              <img 
                                src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`} 
                                alt={vid.title}
                                className="w-full h-full object-cover opacity-80"
                              />
                              <button
                                onClick={() => handleWatchVideo(vid)}
                                disabled={isLocked}
                                className={`absolute h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 cursor-pointer ${
                                  isLocked ? 'bg-slate-600/80 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white'
                                }`}
                              >
                                <Play className="w-6 h-6 fill-current" />
                              </button>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-slate-800 text-lg">{vid.title}</h3>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{vid.description}</p>
                              
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-semibold">
                                  {lang === 'ar' ? 'الحد المسموح:' : 'Views allowed:'} <span className="text-slate-900 font-bold">{vid.maxViews === 'unlimited' ? t.unlimitedViews : vid.maxViews}</span>
                                </span>
                                <span className={`font-bold px-2 py-0.5 rounded-full ${
                                  isLocked ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                  {lang === 'ar' ? `شاهدت ${viewCount} مرات` : `Watched ${viewCount} times`}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeVideo && (
                <div>
                  <button 
                    onClick={() => setActiveVideo(null)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm mb-6 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t.backToDashboard}
                  </button>
                  <h2 className="text-2xl font-black text-slate-800 mb-1">{activeVideo.title}</h2>
                  <p className="text-sm text-slate-500 mb-4">{activeVideo.description}</p>
                  
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                      title={activeVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* --- 2. TESTS TAB --- */}
              {activeTab === 'tests' && !activeTest && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 mb-1">{t.interactiveTests}</h2>
                  <p className="text-sm text-slate-500 mb-6">
                    {lang === 'ar' ? 'حل الاختبارات التفاعلية وحصل على النتيجة الفورية للتصحيح الذاتي.' : 'Complete tests and check your answers instantly.'}
                  </p>

                  {tests.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">{t.noTests}</div>
                  ) : (
                    <div className="space-y-4">
                      {tests.map((test) => {
                        const solvedAttempts = attempts.filter(a => a.testId === test.id);
                        const isMaxed = test.maxAttempts !== 'unlimited' && solvedAttempts.length >= Number(test.maxAttempts);
                        const bestScore = solvedAttempts.length > 0 ? Math.max(...solvedAttempts.map(a => a.score)) : null;
                        const maxPoints = solvedAttempts.length > 0 ? solvedAttempts[0].totalPoints : null;

                        return (
                          <div key={test.id} className="p-4 border border-slate-100 rounded-2xl hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                                  {test.type === 'drag-drop' ? (lang === 'ar' ? 'اختبار ذكي تفاعلي' : 'Auto-Correct Quiz') : (lang === 'ar' ? 'ملف HTML خارجي' : 'Custom HTML Code File')}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {lang === 'ar' ? `المحاولات المسموحة: ${test.maxAttempts}` : `Max attempts: ${test.maxAttempts}`}
                                </span>
                              </div>
                              <h3 className="font-extrabold text-slate-800 text-lg mt-1">{test.title}</h3>
                              <p className="text-slate-500 text-xs mt-0.5">{test.description}</p>
                              
                              {bestScore !== null && (
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  {lang === 'ar' 
                                    ? `أفضل نتيجة: ${bestScore} / ${maxPoints} (تم الحل ${solvedAttempts.length} مرات)` 
                                    : `Best Score: ${bestScore} / ${maxPoints} (Solved ${solvedAttempts.length} times)`}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setActiveTest(test);
                                setTestAnswers({});
                                setTestResult(null);
                              }}
                              disabled={isMaxed}
                              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1 shadow-md transition transform cursor-pointer shrink-0 w-full md:w-auto justify-center ${
                                isMaxed 
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]'
                              }`}
                            >
                              {solvedAttempts.length > 0 ? (lang === 'ar' ? 'إعادة الاختبار' : 'Repeat Test') : t.solveTest}
                              <ChevronRight className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTest && (
                <div>
                  <button 
                    onClick={() => { setActiveTest(null); setTestResult(null); }}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm mb-6 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t.backToDashboard}
                  </button>

                  <div className="max-w-2xl mx-auto">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6">
                      <span className="text-blue-700 font-bold text-xs uppercase tracking-wider block mb-1">Active Exam</span>
                      <h2 className="text-2xl font-black text-slate-900">{activeTest.title}</h2>
                      <p className="text-sm text-slate-600 mt-1">{activeTest.description}</p>
                    </div>

                    {/* Check if test solved result is visible */}
                    {testResult ? (
                      <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-3xl">
                        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-2xl font-black text-slate-800">{lang === 'ar' ? 'تم اكتمال الاختبار بنجاح!' : 'Test Completed!'}</h3>
                        <p className="text-slate-500 mt-1">{lang === 'ar' ? 'تم تصحيح إجاباتك فورياً وبشكل تلقائي.' : 'Your answers have been graded automatically.'}</p>
                        <div className="my-6 inline-block bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
                          <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">{t.score}</span>
                          <span className="text-4xl font-black text-blue-600">
                            {testResult.score} / {testResult.total}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => { setActiveTest(null); setTestResult(null); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition cursor-pointer"
                          >
                            {t.backToDashboard}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* 2a. DRAG-DROP / AUTO-CORRECT Standard Test */}
                        {activeTest.type === 'drag-drop' && (
                          <div className="space-y-6">
                            {JSON.parse(activeTest.content).map((q: any, qIdx: number) => (
                              <div key={q.id} className="p-5 border border-slate-100 rounded-2xl shadow-sm bg-slate-50/50">
                                <span className="text-xs text-blue-600 font-black">
                                  {lang === 'ar' ? `السؤال ${qIdx + 1} (${q.points || 5} درجات)` : `Question {qIdx + 1} (${q.points || 5} points)`}
                                </span>
                                <p className="font-extrabold text-slate-800 text-lg mt-1 mb-4">{q.text}</p>
                                
                                {/* Multiple choice choices */}
                                {q.type === 'multiple-choice' && q.options && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {q.options.map((opt: string) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setTestAnswers({ ...testAnswers, [q.id]: opt })}
                                        className={`p-3 rounded-xl border text-left text-sm font-bold transition cursor-pointer ${
                                          testAnswers[q.id] === opt
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {/* True / False choices */}
                                {q.type === 'true-false' && (
                                  <div className="flex gap-4">
                                    {['True', 'False'].map((val) => (
                                      <button
                                        key={val}
                                        type="button"
                                        onClick={() => setTestAnswers({ ...testAnswers, [q.id]: val })}
                                        className={`flex-1 p-3 rounded-xl border text-center text-sm font-bold transition cursor-pointer ${
                                          testAnswers[q.id] === val
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                        }`}
                                      >
                                        {val}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {/* Fill in the blank box */}
                                {q.type === 'fill-blank' && (
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Type your answer here..."
                                      value={testAnswers[q.id] || ''}
                                      onChange={(e) => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}

                            <div className="pt-4">
                              <button
                                onClick={handleSolveTestSubmit}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 transition transform hover:scale-[1.01] cursor-pointer"
                              >
                                {lang === 'ar' ? 'إرسال إجاباتي والتصحيح الآن' : 'Submit and Self-Grade Test'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 2b. HTML Sandboxed Iframe Test */}
                        {activeTest.type === 'html' && (
                          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-md">
                            <div className="bg-slate-100 p-2.5 border-b text-xs text-slate-500 font-bold flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                              Interactive HTML Exam Mode (Submits score automatically)
                            </div>
                            <iframe
                              srcDoc={activeTest.content}
                              title="Interactive HTML Test"
                              className="w-full min-h-[500px]"
                              sandbox="allow-scripts allow-modals"
                            ></iframe>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* --- 3. BOOKS TAB --- */}
              {activeTab === 'books' && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 mb-1">{t.booksWorkbooks}</h2>
                  <p className="text-sm text-slate-500 mb-6">{t.openBooklet}</p>

                  {books.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">{t.noBooks}</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {books.map((book) => (
                        <div key={book.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-start gap-4 justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-800">{book.title}</h3>
                              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{book.description}</p>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold mt-2 inline-block">
                                {book.type === 'html' ? t.interactiveTool : t.pdfDocument}
                              </span>
                            </div>
                          </div>
                          {book.type === 'html' ? (
                            <button
                              onClick={() => setActiveHtmlBook(book)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1 text-xs font-bold border border-amber-200"
                            >
                              <Eye className="w-4 h-4" />
                              {t.openBooklet}
                            </button>
                          ) : (
                            <a
                              href={book.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1 text-xs font-bold"
                              title={t.downloadPdf}
                            >
                              <Download className="w-4 h-4" />
                              {t.downloadPdf}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- 4. STUDY WORDS TAB --- */}
              {activeTab === 'words' && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 mb-1">{t.vocabularySpelling}</h2>
                  <p className="text-sm text-slate-500 mb-6">{lang === 'ar' ? 'استكشف معاني الكلمات الإنجليزية وترجماتها مع خيار النطق والتدريب.' : 'Build your translation and vocabulary. Listen to pronunciations.'}</p>

                  {words.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">{t.noWords}</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {words.map((w) => (
                        <div key={w.id} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="font-black text-xl text-blue-600">{w.word}</h3>
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                w.type === 'html' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {w.type === 'html' ? t.interactiveTool : w.partOfSpeech || 'Word'}
                              </span>
                            </div>
                            {w.type !== 'html' ? (
                              <>
                                <p className="text-slate-800 font-extrabold text-lg text-right mt-1.5 text-indigo-900" dir="rtl">
                                  {w.translation}
                                </p>
                                <p className="text-xs text-slate-600 mt-2 italic">“ {w.meaning} ”</p>
                                {w.example && (
                                  <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border-l-2 border-slate-300">
                                    <strong>Example:</strong> {w.example}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-xs text-slate-600 mt-2 font-medium bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                                {w.meaning}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                            {w.type === 'html' ? (
                              <button
                                onClick={() => setActiveHtmlWord(w)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg text-xs font-bold transition cursor-pointer border border-amber-200"
                              >
                                <Eye className="w-4 h-4" />
                                {t.launchStudyTool}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSpeak(w.word)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition cursor-pointer"
                              >
                                <Volume2 className="w-4 h-4" />
                                {t.pronounce}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- 5. GRADES & HISTORY TAB --- */}
              {activeTab === 'grades' && (
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 mb-1">{t.solvedLogs}</h2>
                  <p className="text-sm text-slate-500 mb-6">{lang === 'ar' ? 'درجاتك وتقييم محاولات حل الاختبارات التفاعلية والدروس.' : 'See your grades and performance feedback on all submitted exams.'}</p>

                  {attempts.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">{lang === 'ar' ? 'لم تقم بحل أي اختبارات تفاعلية بعد.' : "You haven't solved any tests yet."}</div>
                  ) : (
                    <div className="space-y-4">
                      {attempts.map((attempt) => {
                        const scorePercentage = (attempt.score / attempt.totalPoints) * 100;
                        const isExcellent = scorePercentage >= 85;
                        const isPassing = scorePercentage >= 50;

                        return (
                          <div key={attempt.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/40">
                            <div>
                              <div className="text-xs text-slate-400 font-semibold">
                                {lang === 'ar' ? `تاريخ الحل: ${new Date(attempt.solvedAt).toLocaleString()}` : `Solve date: ${new Date(attempt.solvedAt).toLocaleString()}`}
                              </div>
                              <h3 className="font-extrabold text-slate-800 text-md mt-1">
                                {tests.find(t => t.id === attempt.testId)?.title || 'Completed Exam'}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {lang === 'ar' ? `المحاولة رقم ${attempt.attemptNumber}` : `Attempt #${attempt.attemptNumber}`}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span className={`text-xl font-black ${
                                  isExcellent ? 'text-emerald-600' : isPassing ? 'text-amber-500' : 'text-rose-600'
                                }`}>
                                  {attempt.score} / {attempt.totalPoints}
                                </span>
                                <div className="text-[10px] text-slate-400 font-bold">
                                  {scorePercentage.toFixed(0)}% {lang === 'ar' ? 'إجابة صحيحة' : 'Correct'}
                                </div>
                              </div>

                              <div className="p-1.5 rounded-full">
                                {isPassing ? (
                                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-rose-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* --- MODAL: INTERACTIVE HTML BOOKLET VIEWER --- */}
      {activeHtmlBook && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl border flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Interactive Syllabus Booklet</span>
                <h3 className="font-black text-lg leading-tight">{activeHtmlBook.title}</h3>
              </div>
              <button 
                onClick={() => setActiveHtmlBook(null)} 
                className="text-slate-400 hover:text-white text-2xl font-black cursor-pointer px-3 py-1 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
              >
                ×
              </button>
            </div>
            <div className="flex-1 bg-slate-50 relative">
              <iframe
                srcDoc={activeHtmlBook.htmlContent}
                title={activeHtmlBook.title}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-modals"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: INTERACTIVE HTML VOCAB VIEWER --- */}
      {activeHtmlWord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl border flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Interactive Vocabulary Study Tool</span>
                <h3 className="font-black text-lg leading-tight">{activeHtmlWord.word}</h3>
              </div>
              <button 
                onClick={() => setActiveHtmlWord(null)} 
                className="text-slate-400 hover:text-white text-2xl font-black cursor-pointer px-3 py-1 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
              >
                ×
              </button>
            </div>
            <div className="flex-1 bg-slate-50 relative">
              <iframe
                srcDoc={activeHtmlWord.htmlContent}
                title={activeHtmlWord.word}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-modals"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
