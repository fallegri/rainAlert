export interface LatLng {
  lat: number;
  lng: number;
}

export type TrajectoryVerdict = 'ALERTA DE IMPACTO' | 'PASARÁ DE LARGO';
export type FinalVerdict = 'TE SALVAS' | 'TE MOJAS' | 'PISO MOJADO';

export interface ActiveWeatherZone {
  id: string;
  zone_name: string;
  latitude: number;
  longitude: number;
  current_condition: string;
  last_updated: string;
}

export interface PredictionLog {
  id?: string;
  origin_zone: string;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  distance_km: number;
  calculated_storm_eta_min: number;
  user_eta_min: number;
  overlap_verdict: FinalVerdict;
  user_feedback_correct?: boolean | null;
  created_at?: string;
}

export interface Particle {
  id: number;
  lat: number;
  lng: number;
  opacity: number;
}
