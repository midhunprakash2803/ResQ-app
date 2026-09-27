import React, { useState, useEffect } from 'react';
import { Wrench, Sparkles, Shield, Clock, MapPin, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, isLoading } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate floating particle positions
    const generated = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: i * 0.4,
    }));
    setParticles(generated);
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      const msg = err?.code === 'auth/popup-closed-by-user'
        ? 'Sign-in was cancelled. Please try again.'
        : err?.code === 'auth/popup-blocked'
        ? 'Pop-up was blocked by browser. Please allow pop-ups for this site.'
        : 'Sign-in failed. Please check your connection and try again.';
      setError(msg);
    }
  };

  const features = [
    { icon: Zap, text: 'AI-powered instant diagnosis' },
    { icon: MapPin, text: 'Real-time GPS tracking' },
    { icon: Clock, text: '~8 min average response' },
    { icon: Shield, text: 'Verified mechanics only' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 login-gradient-bg" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 login-grid-overlay opacity-20" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500/30 animate-float-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow-delay" />

      {/* Language & Theme switcher top-right */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        {/* Language */}
        <div className="flex items-center gap-1 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-2 py-1.5">
          {(['en', 'ta', 'hi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                language === lang
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'ta' ? 'தமிழ்' : 'हि'}
            </button>
          ))}
        </div>

        {/* Theme */}
        <div className="flex items-center gap-1 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-2 py-1.5">
          {[
            { key: 'light', emoji: '☀️' },
            { key: 'dark', emoji: '🌙' },
            { key: 'system', emoji: '💻' },
          ].map(({ key, emoji }) => (
            <button
              key={key}
              onClick={() => setTheme(key as any)}
              className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                theme === key
                  ? 'bg-orange-500 shadow scale-110'
                  : 'hover:bg-white/10'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glass card */}
        <div className="login-glass-card rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="login-logo-ring p-4 rounded-2xl">
                <BrandLogo size="lg" showTagline={false} />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Welcome to RoadResQ</h1>
            <p className="text-sm text-white/60 font-medium">
              AI-powered roadside assistance, 24/7
            </p>
          </div>

          {/* Features strip */}
          <div className="grid grid-cols-2 gap-2 mb-8">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                <Icon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="text-[11px] text-white/70 font-medium leading-tight">{text}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full google-signin-btn flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl mb-4"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                <span>Signing you in...</span>
              </>
            ) : (
              <>
                {/* Google G icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24A7.18 7.18 0 0 1 4.89 12c0-.78.14-1.54.38-2.24V6.61H1.27A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.27 5.39l4-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
                <span>Continue with Google</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 font-medium">For providers & admins</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Info text */}
          <p className="text-center text-[11px] text-white/40 leading-relaxed">
            By continuing, you agree to RoadResQ's{' '}
            <span className="text-orange-400 cursor-pointer hover:text-orange-300">Terms of Service</span>{' '}
            and{' '}
            <span className="text-orange-400 cursor-pointer hover:text-orange-300">Privacy Policy</span>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="text-white font-black text-lg">4.9★</div>
            <div className="text-white/40 text-[10px] font-medium">Rating</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-white font-black text-lg">~8m</div>
            <div className="text-white/40 text-[10px] font-medium">Avg. ETA</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-white font-black text-lg">24/7</div>
            <div className="text-white/40 text-[10px] font-medium">Coverage</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-white font-black text-lg">100%</div>
            <div className="text-white/40 text-[10px] font-medium">Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
