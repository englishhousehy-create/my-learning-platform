import React, { useState, useEffect } from 'react';
import { 
  Users, Video, FileText, BookOpen, Languages, Plus, Trash2, Edit2, CheckCircle, 
  XCircle, ToggleLeft, ToggleRight, ArrowUp, ArrowDown, LogOut, Bell, Search, 
  Filter, ShieldAlert, Sparkles, Upload, FileCode, Clock, RefreshCw, UserPlus, Eye, Lock, Megaphone
} from 'lucide-react';
import { User, Video as VideoType, Test as TestType, Book, Word, TestAttempt, AppNotification, Announcement, AppSettings } from '../types';
import { Language, translations } from '../translations';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function TeacherDashboard({ user, onLogout, lang, setLang }: TeacherDashboardProps) {
  const t = translations[lang];
  const isAdmin = user.role === 'admin';
  const [activeTab, setActiveTab] = useState<'students' | 'videos' | 'tests' | 'books' | 'words' | 'analytics' | 'teachers' | 'announcements'>('students');
  
  // Data lists
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [tests, setTests] = useState<TestType[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [videoViews, setVideoViews] = useState<any[]>([]);

  // Filtering states
  const [studentSearch, setStudentSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Loading / State control
  const [loading, setLoading] = useState(false);
  const [parseLoading, setParseLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Forms Modals / States
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [userModalType, setUserModalType] = useState<'create-student' | 'create-teacher' | 'edit-user'>('create-student');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form Values - User
  const [formUserName, setFormUserName] = useState('');
  const [formUserPhone, setFormUserPhone] = useState('');
  const [formUserPassword, setFormUserPassword] = useState('');
  const [formUserGrade, setFormUserGrade] = useState('10');
  const [formUserUsername, setFormUserUsername] = useState(''); // for teachers
  const [formUserStatus, setFormUserStatus] = useState<'pending' | 'active' | 'suspended'>('active');
  const [formUserIsTrial, setFormUserIsTrial] = useState(false);

  // Form Values - Video
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [formVideoTitle, setFormVideoTitle] = useState('');
  const [formVideoDesc, setFormVideoDesc] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formVideoGrade, setFormVideoGrade] = useState('10');
  const [formVideoMaxViews, setFormVideoMaxViews] = useState<string>('unlimited');
  const [formVideoIsTrial, setFormVideoIsTrial] = useState(false);

  // Form Values - Test
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingTest, setEditingTest] = useState<TestType | null>(null);
  const [formTestTitle, setFormTestTitle] = useState('');
  const [formTestDesc, setFormTestDesc] = useState('');
  const [formTestType, setFormTestType] = useState<'drag-drop' | 'html'>('drag-drop');
  const [formTestGrade, setFormTestGrade] = useState('10');
  const [formTestMaxAttempts, setFormTestMaxAttempts] = useState<string>('unlimited');
  const [formTestIsTrial, setFormTestIsTrial] = useState(false);
  const [dragDropRawText, setDragDropRawText] = useState('');
  const [dragDropQuestions, setDragDropQuestions] = useState<any[]>([]);
  const [htmlCodeText, setHtmlCodeText] = useState('');

  // Form Values - Book
  const [showBookModal, setShowBookModal] = useState(false);
  const [formBookTitle, setFormBookTitle] = useState('');
  const [formBookDesc, setFormBookDesc] = useState('');
  const [formBookUrl, setFormBookUrl] = useState('');
  const [formBookGrade, setFormBookGrade] = useState('10');
  const [formBookType, setFormBookType] = useState<'pdf' | 'html'>('pdf');
  const [formBookHtmlContent, setFormBookHtmlContent] = useState('');
  const [formBookIsTrial, setFormBookIsTrial] = useState(false);

  // Form Values - Word
  const [showWordModal, setShowWordModal] = useState(false);
  const [formWordText, setFormWordText] = useState('');
  const [formWordMeaning, setFormWordMeaning] = useState('');
  const [formWordTranslation, setFormWordTranslation] = useState('');
  const [formWordPOS, setFormWordPOS] = useState('noun');
  const [formWordExample, setFormWordExample] = useState('');
  const [formWordGrade, setFormWordGrade] = useState('10');
  const [formWordType, setFormWordType] = useState<'word' | 'html'>('word');
  const [formWordHtmlContent, setFormWordHtmlContent] = useState('');
  const [formWordIsTrial, setFormWordIsTrial] = useState(false);

  // Drag & drop file hooks for test parsing
  const [isDragging, setIsDragging] = useState(false);

  // Form Values - Announcement
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formAnnTitle, setFormAnnTitle] = useState('');
  const [formAnnContent, setFormAnnContent] = useState('');
  const [formAnnGrade, setFormAnnGrade] = useState('0'); // 0 for all grades
  const [formAnnType, setFormAnnType] = useState<'review' | 'schedule' | 'honor' | 'general'>('general');
  const [formAnnVisible, setFormAnnVisible] = useState(true);

  // Admin Self Change Password Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [myNewPassword, setMyNewPassword] = useState('');
  const [myConfirmPassword, setMyConfirmPassword] = useState('');
  const [passwordChangeSuccessMsg, setPasswordChangeSuccessMsg] = useState('');
  const [passwordChangeErrorMsg, setPasswordChangeErrorMsg] = useState('');

  const [settings, setSettings] = useState<AppSettings>({
    mohamedSalahPicture: '/src/assets/images/mohamed_salah_avatar_1783203726731.jpg',
    hagarAfifiPicture: '/src/assets/images/hagar_afifi_avatar_1783203738368.jpg'
  });

  // Load all platform logs, users, files
  const loadPlatformData = async () => {
    setLoading(true);
    try {
      const [uRes, vRes, tRes, bRes, wRes, nRes, lRes, annRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/videos'),
        fetch('/api/tests'),
        fetch('/api/books'),
        fetch('/api/words'),
        fetch('/api/notifications'),
        fetch('/api/logs'),
        fetch('/api/announcements')
      ]);

      const uData = await uRes.json();
      const vData = await vRes.json();
      const tData = await tRes.json();
      const bData = await bRes.json();
      const wData = await wRes.json();
      const nData = await nRes.json();
      const lData = await lRes.json();
      const annData = await annRes.json();

      const allUsers = uData.users || [];
      setStudents(allUsers.filter((u: User) => u.role === 'student'));
      setTeachers(allUsers.filter((u: User) => u.role === 'teacher'));
      setVideos(vData.videos || []);
      setTests(tData.tests || []);
      setBooks(bData.books || []);
      setWords(wData.words || []);
      setAnnouncements(annData.announcements || []);
      setNotifications(nData.notifications || []);
      setTestAttempts(lData.testAttempts || []);
      setVideoViews(lData.studentLogs || []);
      if (lData.settings) {
        setSettings(lData.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Student Approval API calls
  const handleApproveStudent = async (studentId: string, duration: '1month' | 'unlimited' | 'trial') => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${studentId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration })
      });
      if (res.ok) {
        // Read Notification as well if matching
        const matchingNotif = notifications.find(n => n.data.studentId === studentId);
        if (matchingNotif) {
          await fetch(`/api/notifications/${matchingNotif.id}/read`, { method: 'POST' });
        }
        loadPlatformData();
      } else {
        alert('Failed to approve student.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Suspend Status for Student or Teacher
  const handleToggleSuspendUser = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        loadPlatformData();
      } else {
        alert('Could not update user status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this user? This action is irreversible.')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadPlatformData();
      } else {
        alert('Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create or Update User (Student or Teacher)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (userModalType === 'edit-user' && editingUser) {
        const payload: any = {
          name: formUserName,
          phone: formUserPhone,
          password: formUserPassword,
          status: formUserStatus,
          isTrial: formUserIsTrial,
        };
        if (editingUser.role === 'student') {
          payload.grade = Number(formUserGrade);
        } else {
          payload.username = formUserUsername;
        }

        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setShowUserModal(false);
          loadPlatformData();
        } else {
          const err = await res.json();
          alert(err.error || 'Failed to update user.');
        }
      } else {
        // Create student or teacher
        const payload = {
          name: formUserName,
          phone: formUserPhone,
          password: formUserPassword,
          role: userModalType === 'create-teacher' ? 'teacher' : 'student',
          grade: userModalType === 'create-student' ? Number(formUserGrade) : undefined,
          username: userModalType === 'create-teacher' ? formUserUsername : undefined,
          status: 'active',
          isTrial: userModalType === 'create-student' ? formUserIsTrial : undefined
        };

        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setShowUserModal(false);
          loadPlatformData();
        } else {
          const err = await res.json();
          alert(err.error || 'Failed to create user.');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Self Change Password
  const handleMyPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccessMsg('');
    setPasswordChangeErrorMsg('');

    if (!myNewPassword.trim()) {
      setPasswordChangeErrorMsg(t.enterNewPassword);
      return;
    }

    if (myNewPassword !== myConfirmPassword) {
      setPasswordChangeErrorMsg(t.passwordsDoNotMatch);
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: myNewPassword })
      });
      if (res.ok) {
        setPasswordChangeSuccessMsg(t.passwordChangedSuccess);
        setMyNewPassword('');
        setMyConfirmPassword('');
      } else {
        const err = await res.json();
        setPasswordChangeErrorMsg(err.error || 'Failed to update password.');
      }
    } catch (err) {
      console.error(err);
      setPasswordChangeErrorMsg('Server error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Settings
  const handleUpdateSettings = async (updatedSettings: Partial<AppSettings>) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } else {
        alert('Failed to save supervisor profile settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating settings.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageUpload = (role: 'mohamed' | 'hagar', file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      if (role === 'mohamed') {
        await handleUpdateSettings({ mohamedSalahPicture: base64 });
      } else {
        await handleUpdateSettings({ hagarAfifiPicture: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  // Video Save / Create / Edit
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        title: formVideoTitle,
        description: formVideoDesc,
        youtubeUrl: formVideoUrl,
        grade: Number(formVideoGrade),
        maxViews: formVideoMaxViews === 'unlimited' ? 'unlimited' : Number(formVideoMaxViews),
        isTrial: formVideoIsTrial
      };

      let res;
      if (editingVideo) {
        res = await fetch(`/api/videos/${editingVideo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setShowVideoModal(false);
        loadPlatformData();
      } else {
        alert('Failed to save video lesson.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Video
  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Delete this video lesson?')) return;
    const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
    if (res.ok) loadPlatformData();
  };

  // Re-order videos
  const handleMoveVideo = async (index: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= videos.length) return;

    const listCopy = [...videos];
    const temp = listCopy[index];
    listCopy[index] = listCopy[nextIdx];
    listCopy[nextIdx] = temp;

    const orderedIds = listCopy.map(v => v.id);
    const res = await fetch('/api/videos/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds })
    });
    if (res.ok) {
      loadPlatformData();
    }
  };

  // Toggle Video Visibility
  const handleToggleVideoVisibility = async (video: VideoType) => {
    const res = await fetch(`/api/videos/${video.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !video.visible })
    });
    if (res.ok) loadPlatformData();
  };

  // --- DRAG AND DROP AUTO-CORRECT TESTS parsing with Gemini ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDropTextFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDragDropRawText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleParseTestWithAI = async () => {
    if (!dragDropRawText.trim()) {
      alert('Please paste some test questions or drop a test file first!');
      return;
    }
    setParseLoading(true);
    try {
      const res = await fetch('/api/gemini/parse-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testText: dragDropRawText })
      });
      const data = await res.json();
      if (res.ok && data.questions) {
        setDragDropQuestions(data.questions);
        alert(`Successfully drafted ${data.questions.length} questions using Gemini AI! Please review them below.`);
      } else {
        alert(data.error || 'Failed to parse test questions.');
      }
    } catch (err) {
      console.error(err);
      alert('AI parsing error.');
    } finally {
      setParseLoading(false);
    }
  };

  // Edit parsed question parameters dynamically
  const handleEditQuestion = (idx: number, key: string, val: any) => {
    const copy = [...dragDropQuestions];
    copy[idx] = { ...copy[idx], [key]: val };
    setDragDropQuestions(copy);
  };

  const handleAddQuestionManual = () => {
    setDragDropQuestions([
      ...dragDropQuestions,
      {
        id: 'q-manual-' + Math.random().toString(36).substring(2, 7),
        text: 'Type question text here...',
        type: 'multiple-choice',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        points: 5
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setDragDropQuestions(dragDropQuestions.filter((_, i) => i !== idx));
  };

  // Save parsed/drafted test
  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      let content = '';
      if (formTestType === 'drag-drop') {
        if (dragDropQuestions.length === 0) {
          alert('Please add or parse some questions for this test.');
          setActionLoading(false);
          return;
        }
        content = JSON.stringify(dragDropQuestions);
      } else {
        if (!htmlCodeText.trim()) {
          alert('Please upload or paste interactive HTML test code file.');
          setActionLoading(false);
          return;
        }
        content = htmlCodeText;
      }

      const payload = {
        title: formTestTitle,
        description: formTestDesc,
        type: formTestType,
        content,
        grade: Number(formTestGrade),
        maxAttempts: formTestMaxAttempts === 'unlimited' ? 'unlimited' : Number(formTestMaxAttempts),
        isTrial: formTestIsTrial
      };

      let res;
      if (editingTest) {
        res = await fetch(`/api/tests/${editingTest.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setShowTestModal(false);
        loadPlatformData();
      } else {
        alert('Could not save test.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Upload HTML Test File handler
  const handleHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setHtmlCodeText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  // Delete Test
  const handleDeleteTest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
    if (res.ok) loadPlatformData();
  };

  // Move Test Lesson Order
  const handleMoveTest = async (index: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= tests.length) return;

    const listCopy = [...tests];
    const temp = listCopy[index];
    listCopy[index] = listCopy[nextIdx];
    listCopy[nextIdx] = temp;

    const orderedIds = listCopy.map(t => t.id);
    const res = await fetch('/api/tests/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds })
    });
    if (res.ok) {
      loadPlatformData();
    }
  };

  const handleToggleTestVisibility = async (test: TestType) => {
    const res = await fetch(`/api/tests/${test.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !test.visible })
    });
    if (res.ok) loadPlatformData();
  };

  // Book Save
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        title: formBookTitle,
        description: formBookDesc,
        fileUrl: formBookUrl || '',
        grade: Number(formBookGrade),
        type: formBookType,
        htmlContent: formBookHtmlContent,
        isTrial: formBookIsTrial
      };

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowBookModal(false);
        loadPlatformData();
        setFormBookTitle('');
        setFormBookDesc('');
        setFormBookUrl('');
        setFormBookType('pdf');
        setFormBookHtmlContent('');
        setFormBookIsTrial(false);
      } else {
        alert('Could not upload booklet.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormBookHtmlContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Remove this book booklet?')) return;
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    if (res.ok) loadPlatformData();
  };

  // Word Save
  const handleSaveWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        word: formWordText,
        meaning: formWordMeaning,
        translation: formWordTranslation,
        partOfSpeech: formWordPOS,
        example: formWordExample,
        grade: Number(formWordGrade),
        type: formWordType,
        htmlContent: formWordHtmlContent,
        isTrial: formWordIsTrial
      };

      const res = await fetch('/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowWordModal(false);
        loadPlatformData();
        setFormWordText('');
        setFormWordMeaning('');
        setFormWordTranslation('');
        setFormWordExample('');
        setFormWordType('word');
        setFormWordHtmlContent('');
        setFormWordIsTrial(false);
      } else {
        alert('Could not save vocabulary word.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWordHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormWordHtmlContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteWord = async (id: string) => {
    const res = await fetch(`/api/words/${id}`, { method: 'DELETE' });
    if (res.ok) loadPlatformData();
  };

  // --- ANNOUNCEMENT HANDLERS ---
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        title: formAnnTitle,
        content: formAnnContent,
        grade: Number(formAnnGrade),
        type: formAnnType,
        visible: formAnnVisible
      };

      const url = editingAnnouncement 
        ? `/api/announcements/${editingAnnouncement.id}` 
        : '/api/announcements';
      const method = editingAnnouncement ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowAnnouncementModal(false);
        setEditingAnnouncement(null);
        setFormAnnTitle('');
        setFormAnnContent('');
        setFormAnnGrade('0');
        setFormAnnType('general');
        setFormAnnVisible(true);
        loadPlatformData();
      } else {
        alert('Could not save announcement.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving announcement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    if (res.ok) loadPlatformData();
  };

  const handleToggleAnnouncementVisibility = async (ann: Announcement) => {
    const res = await fetch(`/api/announcements/${ann.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !ann.visible })
    });
    if (res.ok) loadPlatformData();
  };

  const openAnnouncementModalForCreate = () => {
    setEditingAnnouncement(null);
    setFormAnnTitle('');
    setFormAnnContent('');
    setFormAnnGrade('0');
    setFormAnnType('general');
    setFormAnnVisible(true);
    setShowAnnouncementModal(true);
  };

  const openAnnouncementModalForEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setFormAnnTitle(ann.title);
    setFormAnnContent(ann.content);
    setFormAnnGrade(ann.grade.toString());
    setFormAnnType(ann.type);
    setFormAnnVisible(ann.visible);
    setShowAnnouncementModal(true);
  };

  // Open modals setup helpers
  const openUserModal = (type: typeof userModalType, userToEdit: User | null = null) => {
    setUserModalType(type);
    setEditingUser(userToEdit);
    if (userToEdit) {
      setFormUserName(userToEdit.name);
      setFormUserPhone(userToEdit.phone);
      setFormUserPassword(userToEdit.password || '123');
      setFormUserGrade(String(userToEdit.grade || '10'));
      setFormUserStatus(userToEdit.status);
      setFormUserUsername(userToEdit.username || '');
      setFormUserIsTrial(userToEdit.isTrial || false);
    } else {
      setFormUserName('');
      setFormUserPhone('');
      setFormUserPassword('123');
      setFormUserGrade('10');
      setFormUserStatus('active');
      setFormUserUsername('');
      setFormUserIsTrial(false);
    }
    setShowUserModal(true);
  };

  const openVideoModal = (video: VideoType | null = null) => {
    setEditingVideo(video);
    if (video) {
      setFormVideoTitle(video.title);
      setFormVideoDesc(video.description);
      setFormVideoUrl(video.youtubeUrl);
      setFormVideoGrade(String(video.grade));
      setFormVideoMaxViews(String(video.maxViews));
      setFormVideoIsTrial(video.isTrial || false);
    } else {
      setFormVideoTitle('');
      setFormVideoDesc('');
      setFormVideoUrl('');
      setFormVideoGrade('10');
      setFormVideoMaxViews('unlimited');
      setFormVideoIsTrial(false);
    }
    setShowVideoModal(true);
  };

  const openTestModal = (test: TestType | null = null) => {
    setEditingTest(test);
    if (test) {
      setFormTestTitle(test.title);
      setFormTestDesc(test.description);
      setFormTestType(test.type);
      setFormTestGrade(String(test.grade));
      setFormTestMaxAttempts(String(test.maxAttempts));
      setFormTestIsTrial(test.isTrial || false);
      if (test.type === 'drag-drop') {
        setDragDropQuestions(JSON.parse(test.content));
        setDragDropRawText('');
      } else {
        setHtmlCodeText(test.content);
        setDragDropQuestions([]);
      }
    } else {
      setFormTestTitle('');
      setFormTestDesc('');
      setFormTestType('drag-drop');
      setFormTestGrade('10');
      setFormTestMaxAttempts('unlimited');
      setFormTestIsTrial(false);
      setDragDropRawText('');
      setDragDropQuestions([]);
      setHtmlCodeText('');
    }
    setShowTestModal(true);
  };

  // Filter students array
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          student.phone.includes(studentSearch);
    const matchesGrade = gradeFilter === 'all' || student.grade === Number(gradeFilter);
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Dashboard Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-md shadow-blue-500/10">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-display font-bold tracking-tight">English House Management</h1>
                <span className="bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-500/20 tracking-wider">
                  {user.role === 'admin' ? 'MAIN ADMIN' : 'TEACHER STAFF'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Logged in as <span className="text-slate-200 font-semibold">{user.name}</span></p>
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
              onClick={() => {
                setPasswordChangeSuccessMsg('');
                setPasswordChangeErrorMsg('');
                setMyNewPassword('');
                setMyConfirmPassword('');
                setShowChangePasswordModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
              title={t.changePassword}
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.changePassword}</span>
            </button>

            <button
              onClick={loadPlatformData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer border border-slate-700"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-950/20 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Primary Dashboard Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-sm scrollbar-hide">
            {[
              { id: 'students', label: lang === 'ar' ? 'دليل الطلاب' : 'Student Directory', icon: Users, badge: students.filter(s => s.status === 'pending').length },
              { id: 'announcements', label: t.announcements, icon: Megaphone, badge: 0 },
              { id: 'videos', label: lang === 'ar' ? 'فيديوهات الشرح' : 'Lessons Videos', icon: Video },
              { id: 'tests', label: lang === 'ar' ? 'الاختبارات التفاعلية' : 'Interactive Tests', icon: FileText },
              { id: 'books', label: lang === 'ar' ? 'الكتب والكتيبات' : 'Books & Workbooks', icon: BookOpen },
              { id: 'words', label: lang === 'ar' ? 'قوائم الكلمات' : 'Vocabulary Lists', icon: Languages },
              { id: 'analytics', label: lang === 'ar' ? 'سجلات حلول الامتحانات' : 'Solved Attempts Logs', icon: Clock },
              ...(isAdmin ? [{ id: 'teachers', label: lang === 'ar' ? 'طاقم العمل والتعليم' : 'Teacher Staff', icon: ShieldAlert, badge: 0 }] : [])
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-display shrink-0 lg:w-full transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Notification Box */}
          {students.filter(s => s.status === 'pending').length > 0 && (
            <div className="mt-4 bg-amber-50/60 border border-amber-200/50 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs font-display">
                <Bell className="w-4 h-4 text-amber-600" />
                Pending Student Approval
              </div>
              <p className="text-[11px] text-amber-600 mt-1">There are registered students waiting for your access approval.</p>
            </div>
          )}
        </aside>

        {/* Content Section */}
        <main className="flex-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          
          {/* --- STUDENT DIRECTORY TAB --- */}
          {activeTab === 'students' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Student Access Directory</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Approve, edit, suspend, or limit students across grades 1-12.</p>
                  </div>
                  <button
                    onClick={() => openUserModal('create-student')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-200 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register New Student
                  </button>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name or phone..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-9 w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="all">{lang === 'ar' ? 'جميع المراحل والصفوف' : 'All Grades & Stages'}</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                        <option key={g} value={g}>{lang === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>
                      ))}
                      <option value="13">{lang === 'ar' ? 'كورسات صيفية' : 'Summer Courses'}</option>
                    </select>
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Approvals</option>
                    <option value="active">Active Students</option>
                    <option value="suspended">Suspended Accounts</option>
                  </select>
                </div>

                {/* Directory List */}
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">No students found matching your filters.</div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-slate-800">{student.name}</h3>
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                                {student.grade === 13 ? (lang === 'ar' ? 'كورسات صيفية' : 'Summer Courses') : `Grade ${student.grade}`}
                              </span>
                              {student.isTrial && (
                                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-full">
                                  {lang === 'ar' ? 'تجريبي' : 'Demo'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-semibold">Phone: {student.phone}</p>
                            
                            {/* Approval metadata status */}
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-semibold">
                              <Clock className="w-3.5 h-3.5" />
                              {student.status === 'pending' ? (
                                <span className="text-amber-600 bg-amber-50 px-1.5 rounded">Awaiting Approval</span>
                              ) : student.approvedUntil === 'unlimited' ? (
                                <span className="text-emerald-600 bg-emerald-50 px-1.5 rounded">Unlimited access</span>
                              ) : (
                                <span className="text-blue-600 bg-blue-50 px-1.5 rounded">
                                  Approved until: {new Date(student.approvedUntil!).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Student Actions */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {student.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleApproveStudent(student.id, '1month')}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
                              >
                                Approve 1 Month
                              </button>
                              <button
                                onClick={() => handleApproveStudent(student.id, 'unlimited')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
                              >
                                Approve Unlimited
                              </button>
                              <button
                                onClick={() => handleApproveStudent(student.id, 'trial')}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
                              >
                                {lang === 'ar' ? 'تجريبي' : 'Approve Demo'}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleToggleSuspendUser(student.id, student.status)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                  student.status === 'suspended'
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                }`}
                              >
                                {student.status === 'suspended' ? 'Re-Activate' : 'Suspend'}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openUserModal('edit-user', student)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(student.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition cursor-pointer"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- ANNOUNCEMENTS TAB --- */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-blue-600" />
                    {lang === 'ar' ? 'إدارة الإعلانات والتنويهات' : 'Announcements & Alerts Manager'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar' ? 'قم بنشر إعلانات احترافية ومستهدفة لمراحل معينة للإعلان عن مراجعات أو مواعيد أو حفلات تكريم.' : 'Publish professional target-based alerts for reviews, schedules, or honor ceremonies.'}
                  </p>
                </div>
                <button
                  onClick={openAnnouncementModalForCreate}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-200 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {t.addAnnouncement}
                </button>
              </div>

              {announcements.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  {lang === 'ar' ? 'لا يوجد أي إعلانات منشورة حالياً.' : 'No announcements created yet.'}
                </div>
              ) : (
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                  {announcements.map((ann) => {
                    let typeBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                    let typeLabel = t.generalType;
                    if (ann.type === 'review') {
                      typeBadgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                      typeLabel = t.reviewType;
                    } else if (ann.type === 'schedule') {
                      typeBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                      typeLabel = t.scheduleType;
                    } else if (ann.type === 'honor') {
                      typeBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      typeLabel = t.honorType;
                    }

                    return (
                      <div key={ann.id} className={`p-5 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${ann.visible ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadgeColor}`}>
                              {typeLabel}
                            </span>
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                              {ann.grade === 0 ? t.allGrades : `${lang === 'ar' ? 'الصف' : 'Grade'} ${ann.grade}`}
                            </span>
                            {!ann.visible && (
                              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                                {lang === 'ar' ? 'مخفي' : 'Hidden'}
                              </span>
                            )}
                          </div>
                          <h3 className="font-extrabold text-slate-800 text-base">{ann.title}</h3>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(ann.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                          <button
                            onClick={() => handleToggleAnnouncementVisibility(ann)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
                            title={ann.visible ? 'Hide' : 'Show'}
                          >
                            {ann.visible ? (
                              <ToggleRight className="w-6 h-6 text-blue-600 animate-pulse" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={() => openAnnouncementModalForEdit(ann)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* --- VIDEOS LESSONS TAB --- */}
          {activeTab === 'videos' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">Video Lessons Manager</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Publish YouTube videos, limit student watch counts, and sort order.</p>
                </div>
                <button
                  onClick={() => openVideoModal()}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Video Lesson
                </button>
              </div>

              {videos.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No video lessons uploaded yet.</div>
              ) : (
                <div className="space-y-3">
                  {videos.map((vid, idx) => (
                    <div key={vid.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/40">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`} 
                          alt="Thumbnail"
                          className="w-16 h-10 object-cover rounded-lg bg-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800">{vid.title}</h3>
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 rounded-full">
                              {vid.grade === 13 ? (lang === 'ar' ? 'كورسات صيفية' : 'Summer Courses') : `Grade ${vid.grade}`}
                            </span>
                            {vid.isTrial && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                                {lang === 'ar' ? 'تجريبي' : 'Demo'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{vid.description}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">
                            Max Views: {vid.maxViews === 'unlimited' ? 'Unlimited' : `${vid.maxViews} times`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end md:self-auto">
                        <button
                          onClick={() => handleToggleVideoVisibility(vid)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer"
                          title={vid.visible ? "Make Invisible" : "Make Visible"}
                        >
                          {vid.visible ? <ToggleRight className="w-5 h-5 text-blue-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                        </button>
                        <button
                          onClick={() => handleMoveVideo(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleMoveVideo(idx, 'down')}
                          disabled={idx === videos.length - 1}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => openVideoModal(vid)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- TESTS MANAGER TAB --- */}
          {activeTab === 'tests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">Interactive Exam Manager</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Create smart drag & drop auto-graded tests or direct HTML file codes.</p>
                </div>
                <button
                  onClick={() => openTestModal()}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Interactive Test
                </button>
              </div>

              {tests.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No interactive tests created yet.</div>
              ) : (
                <div className="space-y-3">
                  {tests.map((test, idx) => (
                    <div key={test.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800">{test.title}</h3>
                          <span className="bg-slate-100 text-slate-600 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                            {test.type === 'drag-drop' ? 'Auto-Correct' : 'HTML test'}
                          </span>
                          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 rounded-full">
                            {test.grade === 13 ? (lang === 'ar' ? 'كورسات صيفية' : 'Summer Courses') : `Grade ${test.grade}`}
                          </span>
                          {test.isTrial && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                              {lang === 'ar' ? 'تجريبي' : 'Demo'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{test.description}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">
                          Max Repeats: {test.maxAttempts === 'unlimited' ? 'Unlimited' : `${test.maxAttempts} times`}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 self-end md:self-auto">
                        <button
                          onClick={() => handleToggleTestVisibility(test)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer"
                        >
                          {test.visible ? <ToggleRight className="w-5 h-5 text-blue-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                        </button>
                        <button
                          onClick={() => handleMoveTest(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleMoveTest(idx, 'down')}
                          disabled={idx === tests.length - 1}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => openTestModal(test)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- BOOKS MANAGER TAB --- */}
          {activeTab === 'books' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">E-Books Booklet Publisher</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Publish workbook study PDFs or custom HTML interactive materials directly into grade-specific dashboards.</p>
                </div>
                <button
                  onClick={() => setShowBookModal(true)}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Study Book
                </button>
              </div>

              {books.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No books uploaded yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {books.map((b) => (
                    <div key={b.id} className="p-4 border border-slate-100 rounded-2xl flex justify-between items-start bg-slate-50/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-800">{b.title}</h3>
                          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 rounded-full">
                            {b.grade === 13 ? (lang === 'ar' ? 'كورسات صيفية' : 'Summer Courses') : `Grade ${b.grade}`}
                          </span>
                          {b.isTrial && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                              {lang === 'ar' ? 'تجريبي' : 'Demo'}
                            </span>
                          )}
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                            b.type === 'html' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {b.type === 'html' ? 'HTML booklet' : 'PDF link'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteBook(b.id)}
                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- STUDY WORDS TAB --- */}
          {activeTab === 'words' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">Vocabulary & Spelling List</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Post vocabulary spelling, definitions, translations, or interactive HTML vocabulary study tools.</p>
                </div>
                <button
                  onClick={() => setShowWordModal(true)}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Spelling Word
                </button>
              </div>

              {words.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No spelling words posted yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto">
                  {words.map((w) => (
                    <div key={w.id} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-black text-lg text-blue-600">{w.word}</h3>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-blue-50 text-blue-600 text-[9px] font-bold uppercase px-2 rounded-full">
                              {w.grade === 13 ? (lang === 'ar' ? 'كورسات صيفية' : 'Summer Courses') : `Grade ${w.grade}`}
                            </span>
                            {w.isTrial && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                                {lang === 'ar' ? 'تجريبي' : 'Demo'}
                              </span>
                            )}
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              w.type === 'html' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {w.type === 'html' ? 'HTML Study Tool' : 'Spelling Word'}
                            </span>
                            <button
                              onClick={() => handleDeleteWord(w.id)}
                              className="p-1 hover:bg-rose-50 text-rose-500 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {w.type !== 'html' && (
                          <p className="text-slate-800 font-black text-md text-right mt-1" dir="rtl">{w.translation}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1 italic">“ {w.meaning} ”</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- ANALYTICS / SOLVED LOGS TAB --- */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Interactive Activity Tracker</h2>
              <p className="text-xs text-slate-500 mt-0.5 mb-6">See which students solved exams, when they did it, and how many times they watched lessons.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5 text-blue-600">
                    <FileText className="w-4 h-4" />
                    Student Test Attempts
                  </h3>
                  {testAttempts.length === 0 ? (
                    <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl">No student has solved any exams yet.</p>
                  ) : (
                    <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Test Name</th>
                            <th className="p-3">Score</th>
                            <th className="p-3">Attempt #</th>
                            <th className="p-3">Submitted At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {testAttempts.map((att) => {
                            const student = students.find(s => s.id === att.userId);
                            const test = tests.find(t => t.id === att.testId);
                            return (
                              <tr key={att.id} className="hover:bg-slate-50/50">
                                <td className="p-3 font-bold text-slate-800">{student?.name || 'Deleted Student'}</td>
                                <td className="p-3">{test?.title || 'Deleted Exam'}</td>
                                <td className="p-3 font-black text-blue-600">{att.score} / {att.totalPoints}</td>
                                <td className="p-3">Attempt #{att.attemptNumber}</td>
                                <td className="p-3 text-slate-400">{new Date(att.solvedAt).toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5 text-blue-600">
                    <Video className="w-4 h-4" />
                    Student Lesson Video Views
                  </h3>
                  {videoViews.length === 0 ? (
                    <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl">No student has opened any lessons yet.</p>
                  ) : (
                    <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase">
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Video Title</th>
                            <th className="p-3">View Count</th>
                            <th className="p-3">Last Opened</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                          {videoViews.map((view) => {
                            const student = students.find(s => s.id === view.userId);
                            const video = videos.find(v => v.id === view.videoId);
                            return (
                              <tr key={view.id} className="hover:bg-slate-50/50">
                                <td className="p-3 font-bold text-slate-800">{student?.name || 'Deleted Student'}</td>
                                <td className="p-3">{video?.title || 'Deleted Video'}</td>
                                <td className="p-3 font-bold">{view.viewCount} times</td>
                                <td className="p-3 text-slate-400">{new Date(view.viewedAt).toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- TEACHERS TAB (ADMIN ONLY) --- */}
          {activeTab === 'teachers' && isAdmin && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">Teacher Staff Directory</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Register, suspend, or manage other teaching instructors as Mr. Mohamed Salah.</p>
                </div>
                <button
                  onClick={() => openUserModal('create-teacher')}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Instructor Staff
                </button>
              </div>

              {/* Dynamic Supervisor Pictures Upload Panel */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 mb-8 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none select-none text-9xl font-bold translate-x-12 -translate-y-12">
                  📸
                </div>
                
                <div className="relative z-10 mb-6">
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                    {lang === 'ar' ? 'تخصيص صور المشرفين' : 'Supervisor Brand Customization'}
                  </span>
                  <h3 className="text-xl font-extrabold mt-2">
                    {lang === 'ar' ? 'تعديل وتغيير صور المشرفين المعروضة للطلاب' : 'Manage Main Supervisor Showcase Photos'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'ar' 
                      ? 'قم برفع الصور الشخصية لمستر محمد صلاح ومس هاجر عفيفي ليراها الطلاب مباشرة في لوحة التحكم الخاصة بهم.' 
                      : 'Upload customized portrait pictures for Mr. Mohamed Salah and Ms. Hagar Afifi to display live on the student portal.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  
                  {/* Mr. Mohamed Salah Upload */}
                  <div className="bg-slate-800/60 p-4.5 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group shrink-0">
                      <img 
                        src={settings.mohamedSalahPicture} 
                        alt="Mr. Mohamed Salah" 
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg bg-slate-900"
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                        <span className="text-[10px] font-bold text-white">Preview</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div>
                        <h4 className="font-bold text-white text-sm">Mr. Mohamed Salah</h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Prep & Secondary Stage</p>
                      </div>
                      
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رفع صورة جديدة' : 'Upload New Photo'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('mohamed', file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Ms. Hagar Afifi Upload */}
                  <div className="bg-slate-800/60 p-4.5 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group shrink-0">
                      <img 
                        src={settings.hagarAfifiPicture} 
                        alt="Ms. Hagar Afifi" 
                        className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500 shadow-lg bg-slate-900"
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                        <span className="text-[10px] font-bold text-white">Preview</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div>
                        <h4 className="font-bold text-white text-sm">Ms. Hagar Afifi</h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Primary Stage</p>
                      </div>
                      
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رفع صورة جديدة' : 'Upload New Photo'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('hagar', file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              {teachers.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No instructors registered besides you.</div>
              ) : (
                <div className="space-y-3">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
                      <div className="flex items-center gap-3">
                        <img src={teacher.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border" />
                        <div>
                          <h3 className="font-extrabold text-slate-800">{teacher.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Username: {teacher.username} | Phone: {teacher.phone}</p>
                          <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded mt-1 ${
                            teacher.status === 'suspended' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {teacher.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => handleToggleSuspendUser(teacher.id, teacher.status)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            teacher.status === 'suspended' ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600' : 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                          }`}
                        >
                          {teacher.status === 'suspended' ? 'Re-Activate' : 'Suspend'}
                        </button>
                        <button
                          onClick={() => openUserModal('edit-user', teacher)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(teacher.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL 1: USER REGISTRATION / EDIT (STUDENT OR TEACHER) --- */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-lg">
                {userModalType === 'create-student' && 'Add New Student'}
                {userModalType === 'create-teacher' && 'Add Instructor Teacher'}
                {userModalType === 'edit-user' && 'Edit User Profile'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aly Ibrahim"
                  value={formUserName}
                  onChange={(e) => setFormUserName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01002223334"
                  value={formUserPhone}
                  onChange={(e) => setFormUserPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="text"
                  required
                  placeholder="Type password..."
                  value={formUserPassword}
                  onChange={(e) => setFormUserPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              {(userModalType === 'create-student' || (editingUser && editingUser.role === 'student')) && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Grade Level</label>
                    <select
                      value={formUserGrade}
                      onChange={(e) => setFormUserGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 font-medium"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                        <option key={g} value={g}>Grade {g}</option>
                      ))}
                      <option value="13">Summer Courses (كورسات صيفية)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                    <input
                      type="checkbox"
                      id="formUserIsTrial"
                      checked={formUserIsTrial}
                      onChange={(e) => setFormUserIsTrial(e.target.checked)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="formUserIsTrial" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                      Demo Account / حساب تجريبي (يستطيع رؤية المحتوى التجريبي فقط)
                    </label>
                  </div>
                </div>
              )}

              {(userModalType === 'create-teacher' || (editingUser && editingUser.role === 'teacher')) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Staff Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mr_yasser"
                    value={formUserUsername}
                    onChange={(e) => setFormUserUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              )}

              {userModalType === 'edit-user' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Account Status</label>
                  <select
                    value={formUserStatus}
                    onChange={(e) => setFormUserStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              )}

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-xs cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: LESSON VIDEO MODAL --- */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-lg">{editingVideo ? 'Edit Video Lesson' : 'Upload Video Lesson'}</h3>
              <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Past Simple Tense"
                  value={formVideoTitle}
                  onChange={(e) => setFormVideoTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Lesson Description</label>
                <textarea
                  placeholder="What is this video covering..."
                  value={formVideoDesc}
                  onChange={(e) => setFormVideoDesc(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 h-20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">YouTube URL / Video ID</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Grade</label>
                  <select
                    value={formVideoGrade}
                    onChange={(e) => setFormVideoGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                    <option value="13">Summer Courses (كورسات صيفية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Views Limit</label>
                  <select
                    value={formVideoMaxViews}
                    onChange={(e) => setFormVideoMaxViews(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  >
                    <option value="unlimited">Unlimited views</option>
                    <option value="1">1 view max</option>
                    <option value="2">2 views max</option>
                    <option value="3">3 views max</option>
                    <option value="5">5 views max</option>
                    <option value="10">10 views max</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                <input
                  type="checkbox"
                  id="formVideoIsTrial"
                  checked={formVideoIsTrial}
                  onChange={(e) => setFormVideoIsTrial(e.target.checked)}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="formVideoIsTrial" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Demo Lesson / حصة تجريبية (يظهر فقط للطلاب الذين لديهم حساب تجريبي مفعل)
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-xs cursor-pointer"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: TEST BUILDER MODAL (AUTO PARSE AND DRAG AND DROP / HTML CODES) --- */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-lg">{editingTest ? 'Edit Interactive Exam' : 'Create Interactive Exam'}</h3>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveTest} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Test Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 3 Grammar Quiz"
                    value={formTestTitle}
                    onChange={(e) => setFormTestTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Test Description</label>
                  <input
                    type="text"
                    placeholder="Brief objective summary..."
                    value={formTestDesc}
                    onChange={(e) => setFormTestDesc(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Grade</label>
                  <select
                    value={formTestGrade}
                    onChange={(e) => setFormTestGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                    <option value="13">Summer Courses (كورسات صيفية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Attempts Limit</label>
                  <select
                    value={formTestMaxAttempts}
                    onChange={(e) => setFormTestMaxAttempts(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  >
                    <option value="unlimited">Unlimited repeats</option>
                    <option value="1">1 attempt only</option>
                    <option value="2">2 attempts max</option>
                    <option value="3">3 attempts max</option>
                    <option value="5">5 attempts max</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Build Format</label>
                  <select
                    value={formTestType}
                    disabled={!!editingTest}
                    onChange={(e) => setFormTestType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 font-bold"
                  >
                    <option value="drag-drop">Drag & Drop / Auto-Correct</option>
                    <option value="html">Interactive HTML Code</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                <input
                  type="checkbox"
                  id="formTestIsTrial"
                  checked={formTestIsTrial}
                  onChange={(e) => setFormTestIsTrial(e.target.checked)}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="formTestIsTrial" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Demo Test / اختبار تجريبي (يظهر فقط للطلاب الذين لديهم حساب تجريبي مفعل)
                </label>
              </div>

              {/* FORMAT 1: DRAG & DROP / TEXT PARSING VIA GEMINI */}
              {formTestType === 'drag-drop' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                    <span className="text-xs font-bold text-blue-600 block mb-1">Drag and Drop Test Parser (Auto-Correct)</span>
                    <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                      Drop any `.txt` test document or paste raw text. Click <strong className="text-blue-600">Smart Parse with Gemini AI</strong> to automatically parse questions, options, and correct answers!
                    </p>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDropTextFile}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                        isDragging ? 'bg-blue-50 border-blue-600' : 'bg-white border-slate-300 hover:border-blue-500'
                      }`}
                    >
                      <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-xs text-slate-600 font-semibold">Drag & Drop test file here or type text below</p>
                    </div>

                    <textarea
                      placeholder="Paste questions here... e.g. 
1. He _____ football yesterday. [go, goes, went, was going] (Correct: went)"
                      value={dragDropRawText}
                      onChange={(e) => setDragDropRawText(e.target.value)}
                      className="w-full h-24 mt-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleParseTestWithAI}
                        disabled={parseLoading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow disabled:opacity-50 cursor-pointer"
                      >
                        {parseLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Smart Parse with Gemini AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Question list editor */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm">Exam Questions List ({dragDropQuestions.length})</h4>
                      <button
                        type="button"
                        onClick={handleAddQuestionManual}
                        className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        + Add Question Manually
                      </button>
                    </div>

                    {dragDropQuestions.map((q, idx) => (
                      <div key={q.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative space-y-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Question {idx + 1}</label>
                            <input
                              type="text"
                              required
                              value={q.text}
                              onChange={(e) => handleEditQuestion(idx, 'text', e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</label>
                            <select
                              value={q.type}
                              onChange={(e) => handleEditQuestion(idx, 'type', e.target.value)}
                              className="w-full px-2 py-1.5 bg-white border rounded-lg text-xs"
                            >
                              <option value="multiple-choice">Multiple Choice</option>
                              <option value="true-false">True / False</option>
                              <option value="fill-blank">Fill Blank</option>
                            </select>
                          </div>
                        </div>

                        {q.type === 'multiple-choice' && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Options (comma separated)</label>
                            <input
                              type="text"
                              value={q.options ? q.options.join(', ') : ''}
                              onChange={(e) => handleEditQuestion(idx, 'options', e.target.value.split(',').map(s => s.trim()))}
                              className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                              placeholder="goes, go, went, is going"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Correct Answer</label>
                            <input
                              type="text"
                              required
                              value={q.correctAnswer}
                              onChange={(e) => handleEditQuestion(idx, 'correctAnswer', e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                              placeholder="e.g. goes"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Points</label>
                            <input
                              type="number"
                              required
                              value={q.points || 5}
                              onChange={(e) => handleEditQuestion(idx, 'points', Number(e.target.value))}
                              className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FORMAT 2: UPLOAD CUSTOM INTERACTIVE HTML CODE FILE */}
              {formTestType === 'html' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-dashed flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-700 block">Interactive HTML Code Exam</span>
                      <p className="text-[10px] text-slate-500 mt-1">Upload a `.html` file that communicates scores using `postMessage`.</p>
                    </div>
                    <label className="bg-white border text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                      Upload .html
                      <input
                        type="file"
                        accept=".html"
                        onChange={handleHtmlFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">HTML Code Editor / Preview</label>
                    <textarea
                      required
                      placeholder="Paste your <html> code here..."
                      value={htmlCodeText}
                      onChange={(e) => setHtmlCodeText(e.target.value)}
                      className="w-full h-48 px-3 py-2 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-xs cursor-pointer"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: BOOK MODAL --- */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-lg">Add Syllabus Book / Booklet</h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveBook} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Booklet Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High School Workbook 1"
                    value={formBookTitle}
                    onChange={(e) => setFormBookTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description / Notes</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief syllabus guidelines..."
                    value={formBookDesc}
                    onChange={(e) => setFormBookDesc(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Student Grade</label>
                  <select
                    value={formBookGrade}
                    onChange={(e) => setFormBookGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                    <option value="13">Summer Courses (كورسات صيفية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Booklet Format</label>
                  <select
                    value={formBookType}
                    onChange={(e) => setFormBookType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                  >
                    <option value="pdf">Downloadable PDF Link</option>
                    <option value="html">Interactive HTML Page / Booklet</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                <input
                  type="checkbox"
                  id="formBookIsTrial"
                  checked={formBookIsTrial}
                  onChange={(e) => setFormBookIsTrial(e.target.checked)}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="formBookIsTrial" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Demo Booklet / كتاب تجريبي (يظهر فقط للطلاب الذين لديهم حساب تجريبي مفعل)
                </label>
              </div>

              {formBookType === 'pdf' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">PDF File Download Link URL</label>
                  <input
                    type="text"
                    required={formBookType === 'pdf'}
                    placeholder="Paste URL download link..."
                    value={formBookUrl}
                    onChange={(e) => setFormBookUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-dashed flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-700 block">Upload Booklet HTML File</span>
                      <p className="text-[10px] text-slate-500 mt-1">Upload a `.html` page to be rendered as an interactive booklet.</p>
                    </div>
                    <label className="bg-white border text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                      Upload .html
                      <input
                        type="file"
                        accept=".html"
                        onChange={handleBookHtmlFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">HTML Code Editor</label>
                    <textarea
                      required={formBookType === 'html'}
                      placeholder="Paste your custom booklet <html> code here..."
                      value={formBookHtmlContent}
                      onChange={(e) => setFormBookHtmlContent(e.target.value)}
                      className="w-full h-48 px-3 py-2 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-xs cursor-pointer"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: VOCABULARY WORD MODAL --- */}
      {showWordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-black text-lg">Add Vocabulary / Study Tool</h3>
              <button onClick={() => setShowWordModal(false)} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveWord} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">English Word / Study Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accomplish"
                    value={formWordText}
                    onChange={(e) => setFormWordText(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Study Format</label>
                  <select
                    value={formWordType}
                    onChange={(e) => setFormWordType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                  >
                    <option value="word">Standard Spelling Word card</option>
                    <option value="html">Interactive HTML Game / Study page</option>
                  </select>
                </div>
              </div>

              {formWordType === 'word' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Arabic Translation</label>
                      <input
                        type="text"
                        required={formWordType === 'word'}
                        placeholder="e.g. ينجز / يحقق"
                        value={formWordTranslation}
                        onChange={(e) => setFormWordTranslation(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-right text-xs"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Part of Speech</label>
                      <select
                        value={formWordPOS}
                        onChange={(e) => setFormWordPOS(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                      >
                        <option value="noun">Noun</option>
                        <option value="verb">Verb</option>
                        <option value="adjective">Adjective</option>
                        <option value="adverb">Adverb</option>
                        <option value="preposition">Preposition</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">English Definition</label>
                    <input
                      type="text"
                      required={formWordType === 'word'}
                      placeholder="Meaning in English..."
                      value={formWordMeaning}
                      onChange={(e) => setFormWordMeaning(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Example Sentence</label>
                    <input
                      type="text"
                      placeholder="Optional usage example..."
                      value={formWordExample}
                      onChange={(e) => setFormWordExample(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Study Description / Guidelines</label>
                    <input
                      type="text"
                      required={formWordType === 'html'}
                      placeholder="e.g. Play this custom interactive spelling matching game!"
                      value={formWordMeaning}
                      onChange={(e) => setFormWordMeaning(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-dashed flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-700 block">Upload Interactive HTML Study Tool File</span>
                      <p className="text-[10px] text-slate-500 mt-1">Upload a `.html` page containing custom interactive quizzes or visual matching puzzles.</p>
                    </div>
                    <label className="bg-white border text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                      Upload .html
                      <input
                        type="file"
                        accept=".html"
                        onChange={handleWordHtmlFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">HTML Code Editor</label>
                    <textarea
                      required={formWordType === 'html'}
                      placeholder="Paste your custom spelling/game <html> code here..."
                      value={formWordHtmlContent}
                      onChange={(e) => setFormWordHtmlContent(e.target.value)}
                      className="w-full h-48 px-3 py-2 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Grade</label>
                <select
                  value={formWordGrade}
                  onChange={(e) => setFormWordGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 text-xs"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                  <option value="13">Summer Courses (كورسات صيفية)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                <input
                  type="checkbox"
                  id="formWordIsTrial"
                  checked={formWordIsTrial}
                  onChange={(e) => setFormWordIsTrial(e.target.checked)}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="formWordIsTrial" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Demo Word / كلمة تجريبية (يظهر فقط للطلاب الذين لديهم حساب تجريبي مفعل)
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWordModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-xs cursor-pointer"
                >
                  Save Vocabulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ANNOUNCEMENT MODAL --- */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase tracking-wider font-display flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-400" />
                {editingAnnouncement ? (lang === 'ar' ? 'تعديل الإعلان والتنويه' : 'Edit Announcement') : t.addAnnouncement}
              </h3>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="p-6 space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.announcementTitle}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: حفل تكريم الأوائل لشهر يونيو 🏆' : 'e.g. Exam Review Session'}
                  value={formAnnTitle}
                  onChange={(e) => setFormAnnTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.announcementType}</label>
                <select
                  value={formAnnType}
                  onChange={(e) => setFormAnnType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs font-bold"
                >
                  <option value="general">{t.generalType}</option>
                  <option value="review">{t.reviewType}</option>
                  <option value="schedule">{t.scheduleType}</option>
                  <option value="honor">{t.honorType}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.targetGrade}</label>
                  <select
                    value={formAnnGrade}
                    onChange={(e) => setFormAnnGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                  >
                    <option value="0">{t.allGrades}</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                      <option key={g} value={g}>{lang === 'ar' ? `الصف الدراسي ${g}` : `Grade ${g}`}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formAnnVisible}
                      onChange={(e) => setFormAnnVisible(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">{lang === 'ar' ? 'إعلان نشط ومرئي للطلاب' : 'Visible to students'}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.announcementContent}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={lang === 'ar' ? 'اكتب تفاصيل التنويه والإعلان هنا بشكل احترافي ومنسق...' : 'Enter your announcement details here...'}
                  value={formAnnContent}
                  onChange={(e) => setFormAnnContent(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 text-xs cursor-pointer transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-xs cursor-pointer transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-1"
                >
                  {actionLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>{lang === 'ar' ? 'حفظ ونشر التنويه' : 'Save Announcement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 6: SELF CHANGE PASSWORD MODAL --- */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-display">{t.changePassword}</h3>
              </div>
              <button 
                onClick={() => setShowChangePasswordModal(false)} 
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleMyPasswordChange} className="p-6 space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {passwordChangeSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordChangeSuccessMsg}</span>
                </div>
              )}

              {passwordChangeErrorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordChangeErrorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
                  {t.newPassword}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={myNewPassword}
                    onChange={(e) => setMyNewPassword(e.target.value)}
                    className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
                  {t.confirmNewPassword}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={myConfirmPassword}
                    onChange={(e) => setMyConfirmPassword(e.target.value)}
                    className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all text-left"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 text-xs transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-xs transition-colors shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? '...' : t.changePassword}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
