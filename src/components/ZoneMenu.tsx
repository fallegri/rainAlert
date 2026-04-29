'use client';

import type { ActiveWeatherZone } from '../types';

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
        {zones.slice(0, 4).map((zone) => (
          <button
            key={zone.id}
            type="button"
            className={`zone-button ${zone.id === selectedZoneId ? 'active' : ''}`}
            onClick={() => onZoneSelect(zone)}
          >
            <strong>{zone.zone_name}</strong>
            <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '0.92rem' }}>{zone.current_condition}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
