import type { ActiveWeatherZone, LatLng } from '../types';
import { destinationPoint } from './geoUtils';

export const SCZ_CENTER: LatLng = { lat: -17.783, lng: -63.182 };
export const OVERLAP_DURATION_MIN = 45;

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

export const FALLBACK_ZONES: ActiveWeatherZone[] = CARDINAL_POINTS.map((point, index) => {
  const position = destinationPoint(SCZ_CENTER, 8, point.bearing); // 8 km distance
  return {
    id: (index + 1).toString(),
    zone_name: `Zona ${point.name}`,
    latitude: position.lat,
    longitude: position.lng,
    current_condition: point.condition,
    last_updated: ''
  };
});
