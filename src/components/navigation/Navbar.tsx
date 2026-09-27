import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  ShieldAlert,
  ChevronDown,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenSos: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSos }) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const { currentUser, currentRole, setUserRole, isAuthenticated, signInWithGoogle, logout, isLoading } = useAuth();
  const location = useLocation();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks =
    currentRole === 'CUSTOMER'
      ? [
          { to: '/', label: t.nav.home },
          { to: '/assistance', label: t.nav.assistance },
          { to: '/resq-ai', label: t.nav.resqAi, badge: 'AI' },
          { to: '/tracking', label: 'Live Track' },
          { to: '/requests', label: t.nav.requests },
          { to: '/vehicles', label: t.nav.vehicles },
          { to: '/safe-places', label: t.nav.safePlaces },
        ]
      : currentRole === 'PROVIDER'
      ? [
          { to: '/provider', label: t.nav.dashboard },
          { to: '/provider/jobs', label: 'Incoming Jobs' },
          { to: '/tracking', label: 'Active Job Nav' },
          { to: '/provider/earnings', label: t.nav.earnings },
          { to: '/provider/profile', label: 'Verification & Profile' },
        ]
      : [
          { to: '/admin', label: 'Overview' },
          { to: '/admin/providers', label: t.nav.adminProviders },
          { to: '/admin/requests', label: t.nav.adminRequests },
          { to: '/admin/users', label: t.nav.adminUsers },
          { to: '/admin/services', label: t.nav.adminServices },
        ];

  return (
    <header className="sticky top-0 z-40 w-full navbar-glass transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center">
          <BrandLogo size="md" showTagline={false} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-[#FF6500] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: SOS + Google Auth + Language + Theme */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSos}
            className="sos-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs tracking-wider uppercase transition active:scale-95"
            title="Emergency SOS Life Safety Dispatch"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* REAL GOOGLE SIGN-IN OR USER PROFILE DROPDOWN */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email || 'Authenticated User'}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Google Verified Motorist</span>
                    </div>
                  </div>

                  {/* Portal View Switcher (for admins / multi-role) */}
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Portal View
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {(['CUSTOMER', 'PROVIDER', 'ADMIN'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserRole(r);
                          }}
                          className={`py-1 text-[10px] font-bold rounded-md transition ${
                            currentRole === r
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {r === 'CUSTOMER' ? 'User' : r === 'PROVIDER' ? 'Partner' : 'Admin'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50"
            >
              {/* Official Google Vector "G" */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.24A7.18 7.18 0 0 1 4.89 12c0-.78.14-1.54.38-2.24V6.61H1.27A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.27 5.39l4-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-bold"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'EN' : language === 'ta' ? 'தமிழ்' : 'हिन्दी'}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setLangDropdownOpen(false)}
              >
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    language === 'en' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    language === 'ta' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    language === 'hi' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            )}
          </div>

          {/* Theme Mode Switcher */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 p-0.5">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition ${
                theme === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Light theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition ${
                theme === 'dark' ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Dark theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-md transition ${
                theme === 'system' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="System default"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
