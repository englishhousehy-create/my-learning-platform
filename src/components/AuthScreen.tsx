import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Phone, Lock, User as UserIcon, GraduationCap, Image, Upload, CheckCircle2, Globe } from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../translations';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
];

export default function AuthScreen({ onLoginSuccess, lang, setLang }: AuthScreenProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'student-login' | 'student-register' | 'staff-login'>('student-login');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    mohamedSalahPicture: '/src/assets/images/mohamed_salah_avatar_1783203726731.jpg',
    hagarAfifiPicture: '/src/assets/images/hagar_afifi_avatar_1783203738368.jpg'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(err => console.error('Error loading settings in AuthScreen:', err));
  }, []);

  // Form States
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // used for staff
  const [grade, setGrade] = useState('10');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
        setSelectedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'student-login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password, role: 'student' }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed.');
        onLoginSuccess(data.user);
      } else if (activeTab === 'staff-login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, phone, password, role: 'staff' }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed.');
        onLoginSuccess(data.user);
      } else if (activeTab === 'student-register') {
        if (!name || !phone || !password) {
          throw new Error('Please fill in all required fields.');
        }
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            password,
            grade: parseInt(grade),
            avatar: selectedAvatar,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');
        setSuccessMsg(t.pendingApprovalDesc);
        // Reset fields
        setName('');
        setPhone('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative subtle background shapes for Professional Polish feel */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--color-blue-50),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,var(--color-indigo-50),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl shadow-premium border border-slate-100 relative z-10 transition-all duration-300">
        
        {/* Language Selection Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
            <Globe className="w-4 h-4 text-blue-500 animate-spin [animation-duration:8s]" />
            <span>Language / اللغة</span>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                lang === 'en' ? 'bg-premium-gradient text-white shadow-md shadow-blue-500/15' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('ar')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                lang === 'ar' ? 'bg-premium-gradient text-white shadow-md shadow-blue-500/15' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Portal Header */}
        <div className="text-center group">
          <div className="mx-auto h-16 w-16 bg-premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform transition-transform group-hover:scale-105 duration-300">
            <GraduationCap className="h-9 w-9 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-display font-black text-slate-900 tracking-tight leading-tight">
            {t.portalTitle}
          </h2>
        </div>

        {/* Supervised By Section with portraits */}
        <div className="bg-slate-50/70 border border-slate-100 p-5 rounded-2xl space-y-3">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">
            {t.supervisedBy}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* Mr. Mohamed Salah */}
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md opacity-30 scale-105" />
                <img
                  src={settings.mohamedSalahPicture}
                  alt="Mr. Mohamed Salah"
                  className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-500 shadow-md bg-slate-50 transition-transform duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-3">{t.mohamedSalah}</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight font-bold">
                {t.teachingPrepSec}
              </p>
            </div>

            {/* Ms. Hagar Afifi */}
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-amber-200 transition">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-md opacity-30 scale-105" />
                <img
                  src={settings.hagarAfifiPicture}
                  alt="Ms. Hagar Afifi"
                  className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-amber-500 shadow-md bg-slate-50 transition-transform duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-3">{t.hagarAfifi}</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight font-bold">
                {t.teachingPrim}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
          <button
            onClick={() => { setActiveTab('student-login'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-display cursor-pointer ${
              activeTab === 'student-login'
                ? 'bg-white text-blue-700 shadow-md font-extrabold border border-blue-50/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            {t.studentLogin}
          </button>
          <button
            onClick={() => { setActiveTab('student-register'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-display cursor-pointer ${
              activeTab === 'student-register'
                ? 'bg-white text-blue-700 shadow-md font-extrabold border border-blue-50/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            {t.register}
          </button>
          <button
            onClick={() => { setActiveTab('staff-login'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-display cursor-pointer ${
              activeTab === 'staff-login'
                ? 'bg-white text-blue-700 shadow-md font-extrabold border border-blue-50/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            {t.staffPortal}
          </button>
        </div>

        {/* Form Error / Success Messages */}
        {error && (
          <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-lg text-sm font-medium border border-rose-100 text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-4 rounded-lg text-sm border border-emerald-100 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">{t.pendingApproval}</p>
              <p className="leading-relaxed text-emerald-600">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Auth Forms */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {activeTab === 'student-register' && (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.studentFullName}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Omar Hassan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium transition"
                  />
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.gradeLevel}</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium transition appearance-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                      <option key={g} value={g}>
                        {lang === 'ar' ? `الصف ${g}` : `Grade ${g}`}
                      </option>
                    ))}
                    <option value={13}>
                      {lang === 'ar' ? 'كورسات صيفية' : 'Summer Courses'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Profile Picture Option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t.chooseAvatar}</label>
                
                {/* Predefined Avatars */}
                <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setSelectedAvatar(avatar); setCustomAvatar(null); }}
                      className={`relative rounded-full p-0.5 border-2 transition cursor-pointer ${
                        selectedAvatar === avatar && !customAvatar
                          ? 'border-blue-600 scale-110 shadow-md'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Custom Picture Upload */}
                <div className="mt-2 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300">
                  <div className="flex items-center gap-3">
                    {customAvatar ? (
                      <img src={customAvatar} alt="Custom avatar" className="w-10 h-10 rounded-full object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <Image className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <span className="text-xs text-slate-500 font-medium">
                      {customAvatar ? t.customPhotoUploaded : t.uploadPhoto}
                    </span>
                  </div>
                  <label className="cursor-pointer bg-white text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-50 transition flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    Browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Phone Number / Username (for staff) */}
            {activeTab === 'staff-login' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.usernameOrPhone}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. mohamedsalah"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium transition"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.phoneNumber}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium transition"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium transition"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-premium-gradient hover-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {activeTab === 'student-register' ? t.registerAccount : t.logInSecurely}
                </>
              )}
            </button>
          </div>
        </form>



      </div>
    </div>
  );
}
