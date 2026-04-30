import type { ActiveWeatherZone, LatLng } from '../types';
import { destinationPoint, haversineDistance } from './geoUtils';

export const SCZ_CENTER: LatLng = { lat: -17.783, lng: -63.182 };
export const NINTH_RING_KM = 9;
export const OVERLAP_DURATION_MIN = 45;

export const WEATHER_ICON_MAP: Record<string, string> = {
  Lluvia: '🌧️',
  Nublado: '☁️',
  Soleado: '☀️',
  Tormenta: '⛈️',
  'Viento Fuerte': '🌬️'
};

export function getWeatherIcon(condition: string) {
  return WEATHER_ICON_MAP[condition] ?? '❓';
}

export type ZoneLocation = LatLng | { latitude: number; longitude: number };

function normalizeLocation(location: ZoneLocation): LatLng {
  if ('lat' in location && 'lng' in location) {
    return location;
  }
  return { lat: location.latitude, lng: location.longitude };
}

export function isInsideNinthRing(location: ZoneLocation): boolean {
  return haversineDistance(SCZ_CENTER, normalizeLocation(location)) <= NINTH_RING_KM;
}

const CENTRAL_ZONE: ActiveWeatherZone = {
  id: 'central',
  zone_name: 'Central Santa Cruz de la Sierra',
  latitude: SCZ_CENTER.lat,
  longitude: SCZ_CENTER.lng,
  current_condition: 'Soleado',
  last_updated: ''
};

const CARDINAL_POINTS = [
  { name: 'Norte', bearing: 0, condition: 'Lluvia' },
  { name: 'Noreste', bearing: 45, condition: 'Nublado' },
  { name: 'Este', bearing: 90, condition: 'Soleado' },
  { name: 'Sureste', bearing: 135, condition: 'Tormenta' },
  { name: 'Sur', bearing: 180, condition: 'Lluvia' },
  { name: 'Suroeste', bearing: 225, condition: 'Nublado' },
  { name: 'Oeste', bearing: 270, condition: 'Tormenta' },
  { name: 'Noroeste', bearing: 315, condition: 'Soleado' }
];

export const FALLBACK_ZONES: ActiveWeatherZone[] = [
  CENTRAL_ZONE,
  ...CARDINAL_POINTS.map((point, index) => {
    const position = destinationPoint(SCZ_CENTER, 8, point.bearing); // 8 km distance
    return {
      id: (index + 1).toString(),
      zone_name: `Zona ${point.name}`,
      latitude: position.lat,
      longitude: position.lng,
      current_condition: point.condition,
      last_updated: ''
    };
  })
];
