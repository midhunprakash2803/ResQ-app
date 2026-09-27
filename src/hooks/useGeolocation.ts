import { useState, useEffect, useCallback } from 'react';

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy: number;
  address: string;
  city: string;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_LOCATION: GeoLocation = {
  lat: 11.0168,
  lng: 76.9558,
  accuracy: 0,
  address: 'Detecting your location...',
  city: '',
  isLoading: true,
  error: null,
};

async function reverseGeocode(lat: number, lng: number): Promise<{ address: string; city: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'RoadResQ/1.0',
        },
      }
    );
    if (!res.ok) throw new Error('Geocode failed');
    const data = await res.json();

    const addr = data.address || {};
    const city =
      addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.state || '';

    // Build a human-readable short address
    const parts: string[] = [];
    if (addr.road || addr.pedestrian) parts.push(addr.road || addr.pedestrian);
    if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood);
    if (city) parts.push(city);

    const address = parts.length > 0 ? parts.join(', ') : data.display_name?.split(',').slice(0, 3).join(', ') || 'Location detected';
    return { address, city };
  } catch {
    return { address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, city: '' };
  }
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_LOCATION);

  const fetchLocation = useCallback(() => {
    setLocation((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Geolocation not supported by this browser.',
        address: 'Location unavailable',
        city: '',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const { address, city } = await reverseGeocode(latitude, longitude);
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy,
          address,
          city,
          isLoading: false,
          error: null,
        });
      },
      (err) => {
        let msg = 'Unable to get location.';
        if (err.code === err.PERMISSION_DENIED) msg = 'Location permission denied.';
        else if (err.code === err.POSITION_UNAVAILABLE) msg = 'Location signal unavailable.';
        else if (err.code === err.TIMEOUT) msg = 'Location request timed out.';
        setLocation((prev) => ({
          ...prev,
          isLoading: false,
          error: msg,
          address: 'Location unavailable',
          city: '',
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { location, refetch: fetchLocation };
}
