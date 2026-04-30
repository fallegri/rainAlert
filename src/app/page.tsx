'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import ControlPanel from '../components/ControlPanel';
import ResultsPanel from '../components/ResultsPanel';
import ZoneMenu from '../components/ZoneMenu';
import { FALLBACK_ZONES, SCZ_CENTER } from '../lib/constants';
import { calcBearing, calcFinalVerdict, calcStormETA, isAligned, getWindData } from '../lib/geoUtils';
import type { ActiveWeatherZone, FinalVerdict, LatLng } from '../types';
import { useRadarAnimation } from '../hooks/useRadarAnimation';

const MapView = dynamic(() => import('../components/MapView'), { ssr: false });

export default function HomePage() {
  const [zones, setZones] = useState<ActiveWeatherZone[]>(FALLBACK_ZONES);
  const [isFallback, setIsFallback] = useState(true);
  const [selectedZone, setSelectedZone] = useState<ActiveWeatherZone>(FALLBACK_ZONES[0]);
  const [pointB, setPointB] = useState<LatLng>(SCZ_CENTER);
  const [windDir, setWindDir] = useState(180);
  const [windSpeed, setWindSpeed] = useState(25);
  const [userETA, setUserETA] = useState(30);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const pointA = useMemo(
    () => ({ lat: selectedZone.latitude, lng: selectedZone.longitude }),
    [selectedZone]
  );

  const chooseDefaultZone = (zones: ActiveWeatherZone[]) =>
    zones.find((zone) => zone.id === 'central' || zone.zone_name.includes('Central')) ?? zones[0];

  useEffect(() => {
    const updateWind = () => {
      const wind = getWindData();
      setWindDir(wind.dir);
      setWindSpeed(wind.speed);
    };
    updateWind();
    const interval = setInterval(updateWind, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const { particles, start, cancel } = useRadarAnimation({
    pointA,
    windDir,
    isRunning: isSimulationRunning
  });

  useEffect(() => {
    const endpoint = new URL('/api/zones', window.location.origin).toString();

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load zones: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.zones) && data.zones.length > 0) {
          setZones(data.zones);
          setSelectedZone(chooseDefaultZone(data.zones));
          setIsFallback(data.source === 'fallback');
        }
      })
      .catch(() => {
        setZones(FALLBACK_ZONES);
        setSelectedZone(chooseDefaultZone(FALLBACK_ZONES));
        setIsFallback(true);
      });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPointB({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        setPointB(SCZ_CENTER);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  }, []);

  const bearing = useMemo(() => calcBearing(pointA, pointB), [pointA, pointB]);
  const aligned = useMemo(() => isAligned(bearing, windDir), [bearing, windDir]);
  const stormETA = useMemo(() => calcStormETA(calcDistance(pointA, pointB), windSpeed), [pointA, pointB, windSpeed]);
  const trajectoryVerdict = aligned ? 'ALERTA DE IMPACTO' : 'PASARÁ DE LARGO';
  const finalVerdict = useMemo<FinalVerdict>(() => calcFinalVerdict(userETA, stormETA, aligned), [userETA, stormETA, aligned]);

  useEffect(() => {
    if (!finalVerdict) {
      return;
    }

    const payload = {
      origin_zone: selectedZone.zone_name,
      wind_speed_kmh: windSpeed,
      wind_direction_deg: windDir,
      distance_km: calcDistance(pointA, pointB),
      calculated_storm_eta_min: Number.isFinite(stormETA) ? Math.round(stormETA) : 0,
      user_eta_min: userETA,
      overlap_verdict: finalVerdict
    };

    const endpoint = new URL('/api/predictions', window.location.origin).toString();

    fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(() => undefined);
  }, [finalVerdict, selectedZone.zone_name, windSpeed, windDir, pointA, pointB, stormETA, userETA]);

  const handleZoneSelect = (zone: ActiveWeatherZone) => {
    setSelectedZone(zone);
  };

  const handleSimulationStart = () => {
    setIsSimulationRunning(true);
    start();
  };

  const handleSimulationCancel = () => {
    cancel();
    setIsSimulationRunning(false);
  };

  return (
    <main className="app-shell">
      <div className="page-grid">
        <section className="panel hero">
          <div>
            <p className="status-badge">Nowcasting personal</p>
            <h1>SCZ Micro-Clima Tracker</h1>
            <p>Calcula el rumbo, la llegada de la lluvia y el veredicto de impacto para Santa Cruz de la Sierra.</p>
          </div>

          <div className="map-wrapper">
            <MapView
              pointA={pointA}
              pointB={pointB}
              windDir={windDir}
              particles={particles}
              onPointBChange={setPointB}
              currentCondition={selectedZone.current_condition}
            />
          </div>
        </section>

        <aside className="panel">
          <div className="result-card">
            <div className="result-pill" style={{ background: aligned ? '#047857' : '#475569' }}>
              <span className="result-strong">{trajectoryVerdict}</span>
            </div>

            <ResultsPanel
              stormETA={stormETA}
              finalVerdict={finalVerdict}
            />
          </div>

          <div className="panel">
            <ControlPanel
              windDir={windDir}
              windSpeed={windSpeed}
              userETA={userETA}
              isSimulationRunning={isSimulationRunning}
              onUserETAChange={setUserETA}
              onSimulationStart={handleSimulationStart}
              onSimulationCancel={handleSimulationCancel}
            />
          </div>

          <div className="panel">
            <ZoneMenu
              zones={zones}
              selectedZoneId={selectedZone.id}
              onZoneSelect={handleZoneSelect}
              fallback={isFallback}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

function calcDistance(a: LatLng, b: LatLng) {
  const deltaLat = toRad(b.lat - a.lat);
  const deltaLng = toRad(b.lng - a.lng);
  const radA = toRad(a.lat);
  const radB = toRad(b.lat);
  const sinLat = Math.sin(deltaLat / 2);
  const sinLng = Math.sin(deltaLng / 2);
  const earthRadius = 6371;
  const h = sinLat * sinLat + Math.cos(radA) * Math.cos(radB) * sinLng * sinLng;
  return earthRadius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}
