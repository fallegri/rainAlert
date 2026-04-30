'use client';

import type { ActiveWeatherZone } from '../types';
import { WEATHER_ICON_MAP } from '../lib/constants';

interface ZoneMenuProps {
  zones: ActiveWeatherZone[];
  selectedZoneId: string;
  onZoneSelect: (zone: ActiveWeatherZone) => void;
  fallback: boolean;
}

export default function ZoneMenu({ zones, selectedZoneId, onZoneSelect, fallback }: ZoneMenuProps) {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Zonas activas</h2>
        {fallback ? <span className="status-badge">Datos locales</span> : null}
      </div>

      <div className="zone-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {zones.map((zone) => {
          const icon = WEATHER_ICON_MAP[zone.current_condition] ?? '❓';
          const updatedLabel = zone.last_updated
            ? ` · ${new Date(zone.last_updated).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`
            : '';

          return (
            <button
              key={zone.id}
              type="button"
              className={`zone-button ${zone.id === selectedZoneId ? 'active' : ''}`}
              onClick={() => onZoneSelect(zone)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="weather-icon">{icon}</span>
                <strong>{zone.zone_name}</strong>
              </div>
              <p className="zone-meta">{zone.current_condition}{updatedLabel}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
