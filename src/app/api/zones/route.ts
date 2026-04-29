import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { FALLBACK_ZONES } from '../../../lib/constants';

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204, headers: { Allow: 'GET,OPTIONS' } });
}

export async function GET() {
  try {
    const result = await db('SELECT id, zone_name, latitude, longitude, current_condition, last_updated FROM active_weather_zones');
    if (!result || result.length === 0) {
      return NextResponse.json({ zones: FALLBACK_ZONES, source: 'fallback' }, { status: 200 });
    }

    const zones = result.map((row: any) => ({
      id: row.id,
      zone_name: row.zone_name,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      current_condition: row.current_condition,
      last_updated: row.last_updated?.toISOString?.() ?? ''
    }));

    return NextResponse.json({ zones, source: 'database' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ zones: FALLBACK_ZONES, source: 'fallback' }, { status: 200 });
  }
}
