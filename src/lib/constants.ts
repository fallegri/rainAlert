import type { ActiveWeatherZone, LatLng } from '../types';

export const SCZ_CENTER: LatLng = { lat: -17.783, lng: -63.182 };
export const OVERLAP_DURATION_MIN = 45;

export const FALLBACK_ZONES: ActiveWeatherZone[] = [
  {
    id: '1',
    zone_name: 'Zona Norte (Lluvia)',
    latitude: -17.720,
    longitude: -63.182,
    current_condition: 'Lluvia',
    last_updated: ''
  },
  {
    id: '2',
    zone_name: 'Equipetrol (Nublado)',
    latitude: -17.770,
    longitude: -63.200,
    current_condition: 'Nublado',
    last_updated: ''
  },
  {
    id: '3',
    zone_name: 'Plan 3000 (Tormenta)',
    latitude: -17.810,
    longitude: -63.130,
    current_condition: 'Tormenta',
    last_updated: ''
  },
  {
    id: '4',
    zone_name: 'Cotoca (Viento Fuerte)',
    latitude: -17.800,
    longitude: -63.050,
    current_condition: 'Viento Fuerte',
    last_updated: ''
  }
];
