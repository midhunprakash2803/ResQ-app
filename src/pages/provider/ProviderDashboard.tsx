import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Power,
  Clock,
  Star,
  ShieldCheck,
  TrendingUp,
  MapPin,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Navigation,
  Car,
  Bell,
  Play,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAssistance } from '../../contexts/AssistanceContext';
import { storageService } from '../../services/storageService';
import { AssistanceMap } from '../../components/map/AssistanceMap';

export const ProviderDashboard: React.FC = () => {
  const { currentProvider } = useAuth();
  const { activeRequest, updateStatus, completeActiveRequest } = useAssistance();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState<boolean>(currentProvider?.workStatus === 'ONLINE');
  const [incomingJob, setIncomingJob] = useState<any | null>(null);

  const toggleOnline = () => {
    if (!currentProvider) return;
    const newStatus = isOnline ? 'OFFLINE' : 'ONLINE';
    setIsOnline(!isOnline);
    storageService.setProviderWorkStatus(currentProvider.id, newStatus);
  };

  const simulateIncomingJob = () => {
    setIncomingJob({
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Sanjay Ramanathan',
      customerPhone: '+91 98401 77652',
      serviceType: 'Flat Tyre & Puncture Assist',
      vehicle: 'Maruti Suzuki Brezza (TN 07 CA 9081)',
      distanceKm: 1.8,
      payout: 450,
      location: 'Near CTS Siruseri IT Park, OMR, Chennai',
    });
  };

  const handleAcceptJob = () => {
    setIncomingJob(null);
    navigate('/tracking');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Status & Online/Offline Bar */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentProvider?.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
            alt="Provider"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {currentProvider?.businessName || 'Murugan QuickFix Mobile Auto Care'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                {currentProvider?.verificationStatus || 'VERIFIED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Service Unit: {currentProvider?.vehicleType}
            </p>
          </div>
        </div>

        {/* Online/Offline Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={simulateIncomingJob}
            className="px-4 py-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition flex items-center gap-1.5"
            title="Simulate dispatch incoming alert"
          >
            <Bell className="w-4 h-4 text-[#FF6500]" />
            <span>Simulate Incoming Alert</span>
          </button>

          <button
            onClick={toggleOnline}
            className={`px-6 py-3 rounded-2xl font-black text-xs tracking-wider uppercase transition flex items-center gap-2 shadow-md ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'Online & Available' : 'Offline'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Today's Earnings
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{currentProvider?.todayEarnings || 2450}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">4 jobs completed</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Lifetime Payout
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{currentProvider?.totalEarnings.toLocaleString('en-IN') || '1,84,500'}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">Direct bank transfer</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Partner Rating
          </div>
          <div className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <Star className="w-6 h-6 fill-current" />
            <span>{currentProvider?.rating || 4.9}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            {currentProvider?.reviewCount || 342} verified reviews
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed Jobs
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {currentProvider?.completedJobs || 418}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
            99.2% on-time arrival
          </div>
        </div>
      </div>

      {/* Active Job Navigation Console (if assigned) */}
      {activeRequest && (
        <div className="p-6 rounded-3xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-200 dark:border-blue-900/60">
            <div>
              <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-blue-300">
                ACTIVE JOB #{activeRequest.id}
              </span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {activeRequest.serviceType}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-xs uppercase">
                {activeRequest.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AssistanceMap
                customerLocation={activeRequest.location}
                providerLocation={activeRequest.providerLocation}
                height="320px"
                zoom={14}
              />
            </div>

            <div className="space-y-3 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 uppercase font-bold block text-[10px]">
                    Customer & Vehicle
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeRequest.customerName} ({activeRequest.customerPhone})
                  </div>
                  <div className="text-slate-500 font-mono">
                    {activeRequest.vehicle.make} {activeRequest.vehicle.model} • {activeRequest.vehicle.plateNumber}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 uppercase font-bold block text-[10px]">
                    Reported Problem
                  </span>
                  <div className="text-slate-700 dark:text-slate-300 mt-0.5">
                    {activeRequest.problemDescription}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Payout Upon Completion</span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    ₹{activeRequest.totalPrice}
                  </span>
                </div>
              </div>

              {/* Provider Workflow Milestone Step Controls */}
              <div className="space-y-2 pt-2">
                {activeRequest.status === 'PROVIDER_ON_THE_WAY' && (
                  <button
                    onClick={() => updateStatus('ARRIVED', 'Technician arrived at breakdown spot.')}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Mark "Arrived At Vehicle"
                  </button>
                )}

                {activeRequest.status === 'ARRIVED' && (
                  <button
                    onClick={() => updateStatus('ASSISTANCE_IN_PROGRESS', 'Inspection and repair commenced.')}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Start Service / Triage
                  </button>
                )}

                {activeRequest.status === 'ASSISTANCE_IN_PROGRESS' && (
                  <button
                    onClick={() => completeActiveRequest('upi')}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition"
                  >
                    Complete Job & Collect ₹{activeRequest.totalPrice}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Incoming Broadcast Popup */}
      {incomingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border-2 border-[#FF6500] rounded-3xl p-6 shadow-2xl space-y-4 animate-bounce duration-500">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF6500] animate-ping" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  INCOMING EMERGENCY DISPATCH
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">
                {incomingJob.id}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {incomingJob.serviceType}
                </div>
                <div className="text-slate-600 dark:text-slate-400 mt-1">
                  {incomingJob.vehicle}
                </div>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500">Distance</span>
                <span className="font-bold">{incomingJob.distanceKm} km away</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500">Net Provider Payout</span>
                <span className="font-black text-emerald-600 text-sm">₹{incomingJob.payout}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIncomingJob(null)}
                className="py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Decline (Pass to Next)
              </button>
              <button
                onClick={handleAcceptJob}
                className="py-3 rounded-xl bg-[#FF6500] hover:bg-[#ea580c] text-white font-black text-xs shadow-lg shadow-[#FF6500]/30"
              >
                ACCEPT & NAVIGATE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
