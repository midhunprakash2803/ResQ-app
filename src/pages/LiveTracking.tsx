import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MapPin,
  Car,
  Star,
  ChevronRight,
  CreditCard,
  XCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useAssistance } from '../contexts/AssistanceContext';
import { AssistanceMap } from '../components/map/AssistanceMap';
import { RequestStatus } from '../types';

export const LiveTracking: React.FC = () => {
  const {
    activeRequest,
    cancelActiveRequest,
    simulateProviderProgress,
    completeActiveRequest,
    rateRequest,
    isSimulating,
    setIsSimulating,
  } = useAssistance();

  const navigate = useNavigate();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [callAlert, setCallAlert] = useState<string | null>(null);

  if (!activeRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          No Active Assistance Request
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
          You currently don't have an ongoing roadside dispatch. Need help right away?
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => navigate('/assistance')}
            className="px-5 py-2.5 rounded-xl bg-[#FF6500] hover:bg-[#ea580c] text-white font-bold text-xs shadow-md shadow-[#FF6500]/20"
          >
            Request Assistance
          </button>
          <button
            onClick={() => navigate('/resq-ai')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Ask ResQ AI
          </button>
        </div>
      </div>
    );
  }

  const statusSteps: { key: RequestStatus; label: string }[] = [
    { key: 'REQUESTED', label: 'Requested' },
    { key: 'PROVIDER_ASSIGNED', label: 'Assigned' },
    { key: 'PROVIDER_ON_THE_WAY', label: 'On The Way' },
    { key: 'ARRIVED', label: 'Arrived' },
    { key: 'ASSISTANCE_IN_PROGRESS', label: 'In Progress' },
    { key: 'COMPLETED', label: 'Done' },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === activeRequest.status);

  const handleSimulateNext = () => {
    simulateProviderProgress();
  };

  const handlePayment = (method: 'upi' | 'card' | 'cash') => {
    completeActiveRequest(method);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    rateRequest(activeRequest.id, rating, review);
    setShowRatingModal(false);
    navigate('/requests');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Request ID Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#FF6500] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-900/60">
              {activeRequest.id}
            </span>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              {activeRequest.serviceType}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Vehicle: {activeRequest.vehicle.make} {activeRequest.vehicle.model} ({activeRequest.vehicle.plateNumber})
          </p>
        </div>

        {/* Demo Fast-Forward Controller Badge */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSimulateNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            title="Fast-forward next milestone"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Fast-Forward Status</span>
          </button>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
              isSimulating
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60'
                : 'text-slate-500 bg-white dark:bg-slate-700'
            }`}
          >
            {isSimulating ? 'GPS Moving' : 'GPS Paused'}
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Provider Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map */}
        <div className="lg:col-span-2 space-y-4">
          <AssistanceMap
            customerLocation={activeRequest.location}
            providerLocation={activeRequest.providerLocation}
            height="460px"
            zoom={14}
          />

          {/* Stepper Progress */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
              <span>Assistance Status</span>
              <span className="text-blue-600 dark:text-blue-400 uppercase">
                {activeRequest.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1 relative">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                        isCurrent
                          ? 'bg-[#FF6500] text-white ring-4 ring-orange-100 dark:ring-orange-950 animate-pulse'
                          : isPassed
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[10px] leading-tight ${
                        isPassed ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Matched Provider Card & Settle Action */}
        <div className="space-y-4">
          {/* ETA Card */}
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                <Clock className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                  Estimated Arrival
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeRequest.etaMinutes > 0 ? `${activeRequest.etaMinutes} mins` : 'Arrived at Site'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {activeRequest.distanceKm} km away
              </span>
            </div>
          </div>

          {/* Provider Card */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Assigned Roadside Pro
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                Police & KYC Verified
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
                alt={activeRequest.providerName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {activeRequest.providerName || 'Murugan QuickFix Mobile Auto Care'}
                </h3>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{activeRequest.providerRating || 4.9} (342 verified services)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Mobile Rescue Van #TN07-2015
                </p>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCallAlert(`Calling technician at ${activeRequest.providerPhone || '+91 98409 55112'}...`)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Call Provider</span>
              </button>
              <button
                onClick={() => setCallAlert('Direct secure in-app message channel connected.')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Chat</span>
              </button>
            </div>

            {callAlert && (
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs text-center font-medium animate-in fade-in">
                {callAlert}
              </div>
            )}
          </div>

          {/* Service Fee & Settlement Card */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Agreed Roadside Fee</span>
              <span className="font-black text-slate-900 dark:text-white text-base">
                ₹{activeRequest.totalPrice}
              </span>
            </div>

            {activeRequest.status === 'ARRIVED' || activeRequest.status === 'ASSISTANCE_IN_PROGRESS' ? (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Complete Service & Settle
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handlePayment('upi')}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition text-center shadow-sm"
                  >
                    UPI / GPay
                  </button>
                  <button
                    onClick={() => handlePayment('card')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition text-center"
                  >
                    Card
                  </button>
                  <button
                    onClick={() => handlePayment('cash')}
                    className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition text-center"
                  >
                    Cash
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={cancelActiveRequest}
                className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Assistance</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rating & Review Modal after Completion */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Assistance Successfully Completed!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Payment of ₹{activeRequest.totalPrice} settled. How was your experience with {activeRequest.providerName}?
              </p>
            </div>

            {/* Star selector */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 text-2xl transition hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share details on promptness, service quality, or technician expertise..."
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleRatingSubmit}
              className="w-full py-3 rounded-xl bg-[#FF6500] hover:bg-[#ea580c] text-white font-black text-sm tracking-wide transition shadow-lg shadow-[#FF6500]/20"
            >
              SUBMIT RATING & RECEIPT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
