import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204, headers: { Allow: 'POST,OPTIONS' } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await db(
      `INSERT INTO predictions_log
        (origin_zone, wind_speed_kmh, wind_direction_deg, distance_km, calculated_storm_eta_min, user_eta_min, overlap_verdict)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        body.origin_zone,
        body.wind_speed_kmh,
        body.wind_direction_deg,
        body.distance_km,
        body.calculated_storm_eta_min,
        body.user_eta_min,
        body.overlap_verdict
      ]
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Error saving prediction', error);
    return NextResponse.json({ ok: false, error: 'Failed to save prediction' }, { status: 500 });
  }
}
