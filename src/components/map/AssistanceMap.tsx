import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoLocation } from '../../types';

// Custom Map Auto-Fitter
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
};

interface AssistanceMapProps {
  customerLocation: GeoLocation;
  providerLocation?: GeoLocation;
  nearbyPlaces?: { id: string; name: string; lat: number; lng: number; type: string }[];
  height?: string;
  zoom?: number;
  className?: string;
}

export const AssistanceMap: React.FC<AssistanceMapProps> = ({
  customerLocation,
  providerLocation,
  nearbyPlaces = [],
  height = '400px',
  zoom = 14,
  className = '',
}) => {
  // SVG Pin for Customer Incident Location
  const customerIcon = L.divIcon({
    className: 'custom-customer-pin',
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(239, 68, 68, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #DC2626; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.5 7.35 11.76a1 1 0 0 0 1.3 0C12.95 21.5 20 15.4 20 10a8 8 0 0 0-8-8z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

  // SVG Pin for Provider Vehicle (Van / Rescue Truck)
  const providerIcon = L.divIcon({
    className: 'custom-provider-pin',
    html: `
      <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 101, 0, 0.3); animation: pulse 2s infinite;"></div>
        <div style="width: 36px; height: 36px; border-radius: 50%; background: #FF6500; border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(255,101,0,0.4); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
            <path d="M15 18H9"></path>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
            <circle cx="17" cy="18" r="2"></circle>
            <circle cx="7" cy="18" r="2"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  // Safe places icons (Gas station / Hospital)
  const safePlaceIcon = (type: string) =>
    L.divIcon({
      className: 'safe-place-pin',
      html: `
        <div style="width: 28px; height: 28px; border-radius: 50%; background: ${
          type === 'fuel_station' ? '#2563EB' : type === 'hospital' ? '#16A34A' : '#475569'
        }; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
          ${type === 'fuel_station' ? '⛽' : type === 'hospital' ? '🏥' : '🛡️'}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

  const centerPos: [number, number] = [customerLocation.lat, customerLocation.lng];

  // Route coordinate segments
  const routePoints: [number, number][] = providerLocation
    ? [
        [providerLocation.lat, providerLocation.lng],
        // intermediate bend point for realistic road curvature
        [
          (providerLocation.lat + customerLocation.lat) / 2 + 0.002,
          (providerLocation.lng + customerLocation.lng) / 2 - 0.001,
        ],
        [customerLocation.lat, customerLocation.lng],
      ]
    : [];

  return (
    <div
      style={{ height }}
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}
    >
      <MapContainer
        center={centerPos}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={centerPos} zoom={zoom} />

        {/* Clean OpenStreetMap Carto Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Customer Location */}
        <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customerIcon}>
          <Popup>
            <div className="p-1">
              <span className="font-bold text-xs text-red-600 block">Incident Location</span>
              <span className="text-xs text-slate-700">{customerLocation.address}</span>
            </div>
          </Popup>
        </Marker>

        {/* Provider Location (if assigned & moving) */}
        {providerLocation && (
          <Marker position={[providerLocation.lat, providerLocation.lng]} icon={providerIcon}>
            <Popup>
              <div className="p-1">
                <span className="font-bold text-xs text-[#FF6500] block">Assigned Roadside Unit</span>
                <span className="text-xs text-slate-700">{providerLocation.address}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Animated Connection Route Line */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            color="#FF6500"
            weight={4}
            opacity={0.85}
            dashArray="8, 6"
          />
        )}

        {/* Nearby safe places & fuel stations */}
        {nearbyPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={safePlaceIcon(place.type)}
          >
            <Popup>
              <div className="p-1">
                <span className="font-bold text-xs block text-slate-900">{place.name}</span>
                <span className="text-[11px] text-slate-500 capitalize">{place.type.replace('_', ' ')}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
