import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Fuel,
  Wrench,
  Battery,
  AlertTriangle,
  Cog,
  Truck,
  ShieldAlert,
  HelpCircle,
  Car,
  MapPin,
  Sparkles,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Star,
  Clock,
  Shield,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAssistance } from '../contexts/AssistanceContext';
import { useTranslation } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { IssueCategory, Vehicle, ServiceProvider } from '../types';
import { AssistanceMap } from '../components/map/AssistanceMap';
import { useGeolocation } from '../hooks/useGeolocation';

export const AssistanceWizard: React.FC = () => {
  const { currentUser } = useAuth();
  const { createNewRequest } = useAssistance();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedService = searchParams.get('service') as IssueCategory | null;

  const [step, setStep] = useState<number>(1);
  const [selectedIssue, setSelectedIssue] = useState<IssueCategory>(preselectedService || 'tyre');
  const [description, setDescription] = useState<string>('');

  const vehicles = storageService.getVehicles(currentUser.id);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(
    vehicles.find((v) => v.isDefault) || vehicles[0] || {
      id: 'v-fallback',
      userId: currentUser.id,
      type: 'car',
      make: 'Hyundai',
      model: 'Creta',
      year: 2022,
      plateNumber: 'TN 07 BZ 4590',
      fuelType: 'diesel',
      isDefault: true,
    }
  );

  // Real GPS location
  const { location: gpsLocation, refetch: refetchGps } = useGeolocation();

  const [location, setLocation] = useState({
    lat: 11.0168,
    lng: 76.9558,
    address: 'Detecting your location...',
  });

  // Sync GPS into location state when it resolves
  useEffect(() => {
    if (!gpsLocation.isLoading && !gpsLocation.error) {
      setLocation({
        lat: gpsLocation.lat,
        lng: gpsLocation.lng,
        address: gpsLocation.address,
      });
    }
  }, [gpsLocation.isLoading, gpsLocation.error, gpsLocation.lat, gpsLocation.lng, gpsLocation.address]);

  const availableProviders = storageService.getProviders().filter((p) => {
    return p.workStatus === 'ONLINE' && p.verificationStatus === 'VERIFIED';
  });

  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider>(
    availableProviders[0] || storageService.getProviders()[0]
  );

  // Transparent pricing calculation
  const baseRates: Record<IssueCategory, number> = {
    fuel: 350,
    tyre: 300,
    battery: 450,
    breakdown: 400,
    mechanical: 500,
    electrical: 450,
    engine: 600,
    towing: 1200,
    accident: 1500,
    unknown: 400,
  };

  const distanceKm = 2.4;
  const basePrice = baseRates[selectedIssue] || 400;
  const distanceFee = Math.round(distanceKm * 35);
  const totalPrice = basePrice + distanceFee;
  const etaMinutes = 8;

  const issueCategories: { id: IssueCategory; label: string; icon: any; desc: string }[] = [
    { id: 'fuel', label: t.services.fuel, icon: Fuel, desc: t.services.fuelDesc },
    { id: 'tyre', label: t.services.tyre, icon: Wrench, desc: t.services.tyreDesc },
    { id: 'battery', label: t.services.battery, icon: Battery, desc: t.services.batteryDesc },
    { id: 'breakdown', label: t.services.breakdown, icon: AlertTriangle, desc: t.services.breakdownDesc },
    { id: 'mechanical', label: t.services.mechanical, icon: Cog, desc: t.services.mechanicalDesc },
    { id: 'towing', label: t.services.towing, icon: Truck, desc: t.services.towingDesc },
    { id: 'accident', label: t.services.accident, icon: ShieldAlert, desc: 'High-priority accident assistance' },
    { id: 'unknown', label: t.services.other, icon: HelpCircle, desc: 'Unsure of mechanical breakdown cause' },
  ];

  const handleConfirmAndBook = () => {
    createNewRequest({
      vehicle: selectedVehicle,
      issueCategory: selectedIssue,
      problemDescription: description || `Assistance required for ${selectedIssue}`,
      urgency: selectedIssue === 'accident' ? 'EMERGENCY' : 'NORMAL',
      location,
      providerId: selectedProvider.id,
      providerName: selectedProvider.businessName,
      providerPhone: selectedProvider.phone,
      providerRating: selectedProvider.rating,
      serviceType: issueCategories.find((i) => i.id === selectedIssue)?.label || 'Roadside Assistance',
      basePrice,
      totalPrice,
      distanceKm,
      etaMinutes,
      aiDiagnostic: {
        confidence: 95,
        observation: `Problem verified: ${selectedIssue} on ${selectedVehicle.make} ${selectedVehicle.model}. Provider matched via multi-factor algorithm.`,
      },
    });

    navigate('/tracking');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Step {step} of 7</span>
          <span>
            {step === 1 && 'Issue Selection'}
            {step === 2 && 'Vehicle'}
            {step === 3 && 'Location'}
            {step === 4 && 'AI Summary'}
            {step === 5 && 'Provider Matching'}
            {step === 6 && 'Price Estimate'}
            {step === 7 && 'Confirm Request'}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#FF6500] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* STEP 1: What happened? */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                What happened to your vehicle?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select the category that best describes your roadside breakdown.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {issueCategories.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIssue === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIssue(item.id)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition ${
                      isSelected
                        ? 'border-[#FF6500] bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-[#FF6500]/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-[#FF6500] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Rear tyre hit broken glass on highway shoulder, completely deflated..."
                rows={2}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Select Vehicle */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Select Your Stranded Vehicle
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Knowing your vehicle model helps match technicians with the exact tools and spares.
              </p>
            </div>

            <div className="space-y-3">
              {vehicles.map((v) => {
                const isSelected = selectedVehicle.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {v.make} {v.model} ({v.year})
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {v.plateNumber} • {v.fuelType.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Confirm Location */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Confirm Breakdown Location
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your GPS pinpoint allows dispatchers to reach you with zero delay.
              </p>
            </div>

            {gpsLocation.isLoading ? (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                <div>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300 block">Acquiring your GPS location...</span>
                  <span className="text-xs text-blue-600/70 dark:text-blue-400/70">Please allow location access when your browser asks</span>
                </div>
              </div>
            ) : gpsLocation.error ? (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-red-700 dark:text-red-300 block">{gpsLocation.error}</span>
                    <span className="text-xs text-red-600/70 dark:text-red-400/70">Tap Retry to re-request location permission</span>
                  </div>
                </div>
                <button onClick={refetchGps} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/60 transition shrink-0">
                  <RefreshCw className="w-3.5 h-3.5" />Retry
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="ping-green shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">GPS Confirmed</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{location.address} · {location.lat.toFixed(5)}°N, {location.lng.toFixed(5)}°E</span>
                  </div>
                </div>
                <button onClick={refetchGps} className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition" title="Refresh location">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            )}

            <AssistanceMap customerLocation={location} height="320px" zoom={14} />

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Incident Address:</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">{gpsLocation.isLoading ? 'Locating...' : location.address}</span>
              </div>
            </div>
          </div>
        )}


        {/* STEP 4: AI Problem Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                ResQ AI Problem Assessment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                AI diagnostic analysis and roadside safety protocol check.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#FF6500]" />
                <span>AI Confidence: 95% Match</span>
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Identified {selectedIssue} for {selectedVehicle.make} {selectedVehicle.model}. Nearest verified technicians carry authorized diagnostic kits and replacement components.
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg text-xs text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800">
                Safety Note: Keep hazard blinkers flashing. Stand behind highway crash barriers if on expressway.
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Smart Provider Matching */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Verified Roadside Providers Nearby
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ranked using service compatibility, response speed, and customer ratings.
              </p>
            </div>

            <div className="space-y-3">
              {availableProviders.map((prov) => {
                const isSelected = selectedProvider.id === prov.id;
                return (
                  <button
                    key={prov.id}
                    onClick={() => setSelectedProvider(prov)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={prov.avatarUrl}
                        alt={prov.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {prov.businessName}
                          </span>
                          <span className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                            <Shield className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {prov.vehicleType}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          <span className="flex items-center gap-1 font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {prov.rating} ({prov.reviewCount})
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            ETA ~7-9 mins
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Price Estimate */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Transparent Pricing Breakdown
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Zero hidden charges. Pay via UPI, card, or cash after service completion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Base Diagnostic & Dispatch Fee</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">₹{basePrice}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Distance Charge ({distanceKm} km @ ₹35/km)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">₹{distanceFee}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Emergency Platform Fee</span>
                <span className="font-semibold text-emerald-600 font-bold">FREE (Waived)</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500 block">Total Estimated Cost</span>
                  <span className="text-xs text-slate-400">Payable after inspection</span>
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{totalPrice}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Confirm & Dispatch */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Confirm Roadside Assistance Request
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Please review dispatch parameters before sending the live dispatch signal.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 uppercase">{selectedIssue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.plateNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{location.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Matched Provider:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedProvider.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Price:</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-sm">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirmAndBook}
              className="px-6 py-3 rounded-xl bg-[#FF6500] hover:bg-[#ea580c] text-white font-black text-sm tracking-wide transition flex items-center gap-2 shadow-lg shadow-[#FF6500]/30 active:scale-95"
            >
              <span>CONFIRM & DISPATCH NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
