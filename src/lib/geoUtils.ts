import type { FinalVerdict, LatLng } from '../types';

export function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function toDeg(value: number): number {
  return (value * 180) / Math.PI;
}

export function calcBearing(a: LatLng, b: LatLng): number {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const deltaLng = toRad(b.lng - a.lng);

  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export function haversineDistance(a: LatLng, b: LatLng): number {
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function angularDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export function isAligned(bearing: number, windDir: number): boolean {
  return angularDiff(bearing, windDir) <= 45;
}

export function calcStormETA(distanceKm: number, windSpeedKmh: number): number {
  if (windSpeedKmh <= 0) {
    return Infinity;
  }
  return Math.round((distanceKm / windSpeedKmh) * 60);
}

export function calcFinalVerdict(userETA: number, stormETA: number, aligned: boolean): FinalVerdict {
  if (!aligned || !Number.isFinite(stormETA)) {
    return 'TE SALVAS';
  }

  if (userETA < stormETA) {
    return 'TE SALVAS';
  }

  if (userETA <= stormETA + 45) {
    return 'TE MOJAS';
  }

  return 'PISO MOJADO';
}

export function getWindData(): { dir: number; speed: number } {
  const now = Date.now();
  // Dirección del viento varía cada hora
  const dir = (now / 1000 / 60 / 60) % 360;
  // Velocidad varía diariamente con un patrón sinusoidal
  const speed = 20 + 10 * Math.sin(now / 1000 / 60 / 60 / 24 * 2 * Math.PI);
  return { dir: Math.round(dir), speed: Math.max(5, Math.round(speed)) };
}
