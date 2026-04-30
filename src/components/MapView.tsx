'use client';

import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLng, Particle } from '../types';
import { destinationPoint } from '../lib/geoUtils';
import { SCZ_CENTER, NINTH_RING_KM, WEATHER_ICON_MAP } from '../lib/constants';

interface MapViewProps {
  pointA: LatLng;
  pointB: LatLng;
  windDir: number;
  particles: Particle[];
  onPointBChange: (position: LatLng) => void;
  currentCondition: string;
}

export default function MapView({ pointA, pointB, windDir, particles, onPointBChange }: MapViewProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const blueIcon = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
  }, []);

  const conditionIcon = useMemo(() => WEATHER_ICON_MAP[currentCondition] ?? '❓', [currentCondition]);

  const zoneMarkerIcon = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return new L.DivIcon({
      html: `<div class="weather-marker">${conditionIcon}</div>`,
      className: 'weather-marker-icon',
      iconSize: [52, 52],
      iconAnchor: [26, 26]
    });
  }, [conditionIcon]);

  const mapBounds = useMemo(() => {
    const north = destinationPoint(SCZ_CENTER, NINTH_RING_KM, 0);
    const east = destinationPoint(SCZ_CENTER, NINTH_RING_KM, 90);
    const south = destinationPoint(SCZ_CENTER, NINTH_RING_KM, 180);
    const west = destinationPoint(SCZ_CENTER, NINTH_RING_KM, 270);
    return [[south.lat, west.lng], [north.lat, east.lng]] as [number, number][];
  }, []);

  const arrowPoints = useMemo(() => {
    const radians = (windDir * Math.PI) / 180;
    const length = 0.045;
    const lat = pointA.lat + Math.cos(radians) * length;
    const lng = pointA.lng + Math.sin(radians) * length;
    return [[pointA.lat, pointA.lng], [lat, lng]] as [number, number][];
  }, [pointA.lat, pointA.lng, windDir]);

  if (!hasMounted) {
    return <div style={{ minHeight: '540px', background: '#1e293b' }}>Map loading...</div>;
  }

  return (
    <MapContainer
      key={`${pointA.lat}-${pointA.lng}-${currentCondition}`}
      center={[SCZ_CENTER.lat, SCZ_CENTER.lng]}
      bounds={mapBounds}
      zoom={12}
      scrollWheelZoom={true}
      className="leaflet-container"
      style={{ height: '100%', minHeight: '540px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[pointA.lat, pointA.lng]} icon={zoneMarkerIcon}>
        <Tooltip direction="top">Zona activa · {currentCondition}</Tooltip>
      </Marker>

      <Marker
        draggable
        position={[pointB.lat, pointB.lng]}
        icon={blueIcon}
        eventHandlers={{
          dragend(event) {
            const marker = event.target;
            const position = marker.getLatLng();
            onPointBChange({ lat: position.lat, lng: position.lng });
          }
        }}
      >
        <Tooltip direction="top">Tu punto de llegada</Tooltip>
      </Marker>

      <Polyline positions={arrowPoints} pathOptions={{ color: '#facc15', weight: 4, opacity: 0.8 }} />

      {particles.map((particle) => (
        <CircleMarker
          key={particle.id}
          center={[particle.lat, particle.lng]}
          radius={4}
          pathOptions={{ color: '#f97316', opacity: particle.opacity, fillOpacity: particle.opacity }}
        />
      ))}
    </MapContainer>
  );
}
