import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Sparkles,
  MapPin,
  Car,
  Fuel,
  Battery,
  AlertTriangle,
  Cog,
  Truck,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Phone,
  Hospital,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAssistance } from '../contexts/AssistanceContext';
import { useTranslation } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { IssueCategory } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';

export const CustomerHome: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeRequest } = useAssistance();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { location, refetch } = useGeolocation();

  const vehicles = storageService.getVehicles(currentUser.id);
  const defaultVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];
  const safePlaces = storageService.getSafePlaces().slice(0, 3);
  const emergencyContacts = storageService.getEmergencyContacts();

  const quickServices: { id: IssueCategory; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'tyre', label: t.services.tyre, icon: Wrench, color: 'text-amber-600', desc: 'Puncture repair & change' },
    { id: 'battery', label: t.services.battery, icon: Battery, color: 'text-blue-600', desc: 'Jumpstart & diagnostics' },
    { id: 'fuel', label: t.services.fuel, icon: Fuel, color: 'text-orange-600', desc: 'Fuel pump guidance & tow' },
    { id: 'breakdown', label: t.services.breakdown, icon: AlertTriangle, color: 'text-red-600', desc: 'General breakdown triage' },
    { id: 'towing', label: t.services.towing, icon: Truck, color: 'text-indigo-600', desc: 'Hydraulic flatbed dispatch' },
    { id: 'mechanical', label: t.services.mechanical, icon: Cog, color: 'text-emerald-600', desc: 'Brake, clutch & belt fixes' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Location Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hero-gradient p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24/7 Rapid Response Network Active</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Hello, {currentUser.name}!
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-[#FF6500] shrink-0 location-pulse" />
            {location.isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                <span className="text-slate-400">Detecting your location...</span>
              </span>
            ) : location.error ? (
              <span className="flex items-center gap-2">
                <span className="text-slate-400">{location.error}</span>
                <button onClick={refetch} className="p-1 rounded-md hover:bg-white/10 transition" title="Retry">
                  <RefreshCw className="w-3 h-3 text-slate-400" />
                </button>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>{location.address}</span>
                <button onClick={refetch} className="p-1 rounded-md hover:bg-white/10 transition" title="Refresh location">
                  <RefreshCw className="w-3 h-3 text-slate-400" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/assistance')}
            className="px-6 py-3.5 rounded-2xl bg-[#FF6500] hover:bg-[#ea580c] text-white font-black text-sm tracking-wide shadow-lg shadow-[#FF6500]/30 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            <span>{t.actions.getAssistance}</span>
          </button>
          <button
            onClick={() => navigate('/resq-ai')}
            className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition flex items-center justify-center gap-2 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-[#FF6500]" />
            <span>{t.actions.askResqAi}</span>
          </button>
        </div>
      </div>

      {/* Active Request Alert Banner if ongoing */}
      {activeRequest && (
        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
              <Clock className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                  {activeRequest.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-bold uppercase">
                  {activeRequest.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                {activeRequest.serviceType} — {activeRequest.providerName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ETA: ~{activeRequest.etaMinutes} mins • {activeRequest.distanceKm} km away
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/tracking')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm shrink-0"
          >
            <span>Open Live Tracking Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Saved Vehicle & ResQ AI Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Saved Vehicle Card */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Vehicle
              </span>
              <button
                onClick={() => navigate('/vehicles')}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Manage ({vehicles.length})
              </button>
            </div>
            {defaultVehicle ? (
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {defaultVehicle.make} {defaultVehicle.model}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {defaultVehicle.plateNumber} • {defaultVehicle.fuelType.toUpperCase()}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No vehicles saved yet.</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Roadside Coverage Active</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        {/* ResQ AI Interactive Box */}
        <div className="md:col-span-2 p-6 bg-gradient-to-br from-blue-900/10 via-white to-orange-500/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FF6500]" />
              <span>ResQ AI Voice & Image Diagnostics</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Unsure what is wrong? Talk to ResQ AI in English, தமிழ், or Tanglish.
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Speak or upload a photo of your tyre, dashboard light, or engine bay. ResQ AI coordinates matching technicians instantly.
            </p>
          </div>
          <div className="pt-4 flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/resq-ai')}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>Start Voice or Text Triage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            On-Demand Roadside Assistance
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Average response ~8 mins</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <button
                key={srv.id}
                onClick={() => navigate(`/assistance?service=${srv.id}`)}
                className="service-card p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-[#FF6500]/50 dark:hover:border-[#FF6500]/50 hover:shadow-lg hover:shadow-[#FF6500]/10 transition text-left flex flex-col justify-between h-36 group"
              >
                <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 w-fit ${srv.color}`}>
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                    {srv.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {srv.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safe Places & Emergency Contacts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby Safe Places (Fuel / Hospitals) */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              Nearby 24/7 Safe Hubs
            </h3>
            <button
              onClick={() => navigate('/safe-places')}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {safePlaces.map((sp) => (
              <div
                key={sp.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    {sp.type === 'fuel_station' && <Fuel className="w-3.5 h-3.5 text-blue-500" />}
                    {sp.type === 'hospital' && <Hospital className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>{sp.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{sp.address}</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {sp.distanceKm} km
                  </span>
                  <span className="text-[10px] text-slate-400">~{sp.etaMinutes} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              Registered Emergency Contacts
            </h3>
            <span className="text-xs text-slate-400">{emergencyContacts.length} saved</span>
          </div>

          <div className="space-y-2.5">
            {emergencyContacts.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{c.name}</span>
                  <span className="text-slate-500 ml-1.5">({c.relationship})</span>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition flex items-center gap-1.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
