import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wrench, Sparkles, Clock, Car, Compass, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';

export const MobileNav: React.FC = () => {
  const { currentRole } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const customerItems = [
    { to: '/', label: t.nav.home, icon: Home },
    { to: '/assistance', label: 'Assistance', icon: Wrench },
    { to: '/resq-ai', label: 'ResQ AI', icon: Sparkles, highlight: true },
    { to: '/tracking', label: 'Tracking', icon: Compass },
    { to: '/vehicles', label: 'Vehicles', icon: Car },
  ];

  const providerItems = [
    { to: '/provider', label: 'Dashboard', icon: Home },
    { to: '/provider/jobs', label: 'Jobs', icon: Wrench },
    { to: '/tracking', label: 'Active Nav', icon: Compass, highlight: true },
    { to: '/provider/earnings', label: 'Earnings', icon: BarChart3 },
    { to: '/provider/profile', label: 'Profile', icon: Users },
  ];

  const adminItems = [
    { to: '/admin', label: 'Overview', icon: BarChart3 },
    { to: '/admin/providers', label: 'Providers', icon: Wrench },
    { to: '/admin/requests', label: 'Live Alerts', icon: Sparkles, highlight: true },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  const items =
    currentRole === 'CUSTOMER'
      ? customerItems
      : currentRole === 'PROVIDER'
      ? providerItems
      : adminItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1528]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const isActive = location.pathname === item.to;
        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${item.highlight ? 'text-[#FF6500]' : ''}`} />
              {item.highlight && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF6500] animate-ping" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
