import React, { useState } from 'react';
import { Fuel, Hospital, Shield, Wrench, Navigation, Phone, Clock, MapPin } from 'lucide-react';
import { storageService } from '../services/storageService';
import { SafePlace, SafePlaceType } from '../types';
import { AssistanceMap } from '../components/map/AssistanceMap';

export const SafePlacesView: React.FC = () => {
  const [safePlaces] = useState<SafePlace[]>(() => storageService.getSafePlaces());
  const [selectedType, setSelectedType] = useState<SafePlaceType | 'all'>('all');

  const filtered =
    selectedType === 'all' ? safePlaces : safePlaces.filter((p) => p.type === selectedType);

  const customerLoc = {
    lat: 12.9249,
    lng: 80.2272,
    address: 'Current Location: OMR Road near Sholinganallur, Chennai',
  };

  const getIcon = (type: SafePlaceType) => {
    if (type === 'fuel_station') return Fuel;
    if (type === 'hospital') return Hospital;
    if (type === 'police') return Shield;
    return Wrench;
  };

  const getColor = (type: SafePlaceType) => {
    if (type === 'fuel_station') return 'text-blue-600 bg-blue-50 dark:bg-blue-950/60';
    if (type === 'hospital') return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60';
    if (type === 'police') return 'text-red-600 bg-red-50 dark:bg-red-950/60';
    return 'text-amber-600 bg-amber-50 dark:bg-amber-950/60';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Nearby Safe Places & Emergency Hubs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Verified 24/7 fuel pumps, trauma medical centers, and police highway patrol stations.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Safe Locations' },
          { id: 'fuel_station', label: '24/7 Fuel Pumps' },
          { id: 'hospital', label: 'Trauma Hospitals & Medical' },
          { id: 'police', label: 'Police & Highway Patrol' },
          { id: 'workshop', label: 'Authorized Workshops' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedType === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Map Overview */}
      <div className="w-full">
        <AssistanceMap
          customerLocation={customerLoc}
          nearbyPlaces={filtered.map((p) => ({
            id: p.id,
            name: p.name,
            lat: p.lat,
            lng: p.lng,
            type: p.type,
          }))}
          height="340px"
          zoom={13}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((place) => {
          const Icon = getIcon(place.type);
          const colorClass = getColor(place.type);

          return (
            <div
              key={place.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-xl ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {place.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {place.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-slate-900 dark:text-white block">
                      {place.distanceKm} km
                    </span>
                    <span className="text-[10px] text-slate-400">~{place.etaMinutes} mins ETA</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {place.address}
                </p>

                {place.extraInfo && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300">
                    {place.extraInfo}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={`tel:${place.phone.split('/')[0].trim()}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  <span>Call {place.phone}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
