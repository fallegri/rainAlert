import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { FALLBACK_ZONES, isInsideNinthRing } from '../../../lib/constants';
import type { ActiveWeatherZone } from '../../../types';

const FALLBACK_WEATHER_STATES = ['Despejado', 'Nublado', 'Lluvia', 'Tormenta', 'Viento Fuerte'];

function createFallbackZones(): ActiveWeatherZone[] {
  const now = new Date();
  const minuteSeed = now.getMinutes();

  return FALLBACK_ZONES.map((zone, index) => {
    const conditionIndex = (index + minuteSeed) % FALLBACK_WEATHER_STATES.length;
    return {
      ...zone,
      current_condition: FALLBACK_WEATHER_STATES[conditionIndex],
      last_updated: now.toISOString()
    };
  });
}

function fallbackResponse() {
  return NextResponse.json(
    { zones: createFallbackZones().filter((zone: ActiveWeatherZone) => isInsideNinthRing(zone)), source: 'fallback' },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204, headers: { Allow: 'GET,OPTIONS' } });
}

export async function GET() {
  try {
    const result = await db('SELECT id, zone_name, latitude, longitude, current_condition, last_updated FROM active_weather_zones');
    if (!result || result.length === 0) {
      return fallbackResponse();
    }

    const zones = result
      .map((row: any) => ({
        id: row.id,
        zone_name: row.zone_name,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        current_condition: row.current_condition,
        last_updated: row.last_updated?.toISOString?.() ?? ''
      }))
      .filter((zone: ActiveWeatherZone) => isInsideNinthRing(zone));

    if (zones.length === 0) {
      return fallbackResponse();
    }

    return NextResponse.json({ zones, source: 'database' }, { status: 200 });
  } catch (error) {
    return fallbackResponse();
  }
}
