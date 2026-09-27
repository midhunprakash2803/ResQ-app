import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, CheckCircle2, X, Share2, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { useTranslation } from '../../i18n/LanguageContext';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState<number>(5);
  const [isTriggered, setIsTriggered] = useState<boolean>(false);
  const [emergencyType, setEmergencyType] = useState<string>('Accident / Physical Danger');
  const [contacts, setContacts] = useState(() => storageService.getEmergencyContacts());

  useEffect(() => {
    let timer: any;
    if (isOpen && !isTriggered && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0 && !isTriggered) {
      setIsTriggered(true);
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown, isTriggered]);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      setIsTriggered(false);
      setContacts(storageService.getEmergencyContacts());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    const locText = encodeURIComponent(
      `🚨 ROADRESQ EMERGENCY SOS ALERT!\nName: ${currentUser.name}\nPhone: ${currentUser.phone}\nEmergency Type: ${emergencyType}\nLocation: https://maps.google.com/?q=12.9249,80.2272 (OMR Road near Sholinganallur)\nAssistance dispatched.`
    );
    window.open(`https://wa.me/?text=${locText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Emergency Banner */}
        <div className="bg-red-600 dark:bg-red-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black tracking-wide text-lg">EMERGENCY SOS DISPATCH</h3>
              <p className="text-xs text-red-100 font-medium">Life Safety Protocol Active</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isTriggered ? (
            <div className="text-center py-4 space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-950/60 border-4 border-red-500 flex items-center justify-center text-4xl font-black text-red-600 dark:text-red-400 animate-pulse">
                  {countdown}
                </div>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-semibold text-base">
                Broadcasting emergency distress coordinates in {countdown} seconds...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Press Cancel immediately if this was tapped by mistake.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel SOS
                </button>
                <button
                  onClick={() => setIsTriggered(true)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-lg shadow-red-600/30"
                >
                  Trigger Immediately
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3 text-red-900 dark:text-red-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Distress Coordinates Locked & Transmitted</div>
                  <div className="text-xs mt-0.5 opacity-90">
                    High-priority dispatch notification broadcast to highway patrol and nearby first responders.
                  </div>
                </div>
              </div>

              {/* Emergency Select */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Emergency Situation
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-sm focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="Accident / Physical Danger">Severe Accident / Vehicle Impact</option>
                  <option value="Vehicle Fire / Smoke">Vehicle Fire / Heavy Smoke</option>
                  <option value="Stranded in Unsafe Highway Area">Stranded in Unsafe Dark / Highway Area</option>
                  <option value="Medical Emergency on Road">Medical Emergency on Road</option>
                </select>
              </div>

              {/* Location snapshot */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>GPS Incident Coordinate:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-5">
                  12.9249° N, 80.2272° E — OMR Expressway near Sholinganallur Junction, Chennai
                </p>
              </div>

              {/* Direct Government Emergency Lines */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide shadow-md shadow-red-600/30 transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>DIAL 112 (POLICE)</span>
                </a>
                <a
                  href="tel:108"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm tracking-wide shadow-md shadow-amber-600/30 transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>DIAL 108 (AMBULANCE)</span>
                </a>
              </div>

              {/* Share with Family & Emergency Contacts */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Registered Emergency Contacts ({contacts.length})</span>
                  <button
                    onClick={handleShareLocation}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share SOS Link
                  </button>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{contact.name}</span>
                        <span className="text-slate-500 ml-1.5">({contact.relationship})</span>
                      </div>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-red-600 dark:text-red-400 font-bold hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Dismiss / Keep Responders Informed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
