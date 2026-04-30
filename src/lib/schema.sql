CREATE TABLE IF NOT EXISTS active_weather_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name VARCHAR(100) NOT NULL,
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  current_condition VARCHAR(50) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_zone VARCHAR(100) NOT NULL,
  wind_speed_kmh DECIMAL(5, 2) NOT NULL,
  wind_direction_deg INTEGER NOT NULL,
  distance_km DECIMAL(8, 4) NOT NULL,
  calculated_storm_eta_min INTEGER NOT NULL,
  user_eta_min INTEGER NOT NULL,
  overlap_verdict VARCHAR(50) NOT NULL,
  user_feedback_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO active_weather_zones (id, zone_name, latitude, longitude, current_condition, last_updated)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'Central Santa Cruz de la Sierra', -17.783, -63.182, 'Soleado', NOW()),
  ('1', 'Zona Norte (Lluvia)', -17.720, -63.182, 'Lluvia', NOW()),
  ('2', 'Equipetrol (Nublado)', -17.770, -63.200, 'Nublado', NOW()),
  ('3', 'Plan 3000 (Tormenta)', -17.810, -63.130, 'Tormenta', NOW()),
  ('4', 'Cotoca (Viento Fuerte)', -17.800, -63.050, 'Viento Fuerte', NOW())
ON CONFLICT DO NOTHING;
