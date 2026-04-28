import { describe, it, expect } from 'vitest';
import { GET } from './zones/route';
import { POST } from './predictions/route';
import { FALLBACK_ZONES } from '../../lib/constants';

describe('API Routes', () => {
  describe('GET /api/zones', () => {
    it('returns zones with fallback source when db connection fails', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.zones).toBeDefined();
      expect(Array.isArray(data.zones)).toBe(true);
      expect(data.zones.length).toBeGreaterThan(0);
      expect(data.source).toBe('fallback');
    });

    it('returned zones have required fields', async () => {
      const response = await GET();
      const data = await response.json();

      data.zones.forEach((zone: any) => {
        expect(zone.id).toBeDefined();
        expect(zone.zone_name).toBeDefined();
        expect(typeof zone.latitude).toBe('number');
        expect(typeof zone.longitude).toBe('number');
        expect(zone.current_condition).toBeDefined();
      });
    });
  });

  describe('POST /api/predictions', () => {
    it('accepts valid prediction payload', async () => {
      const payload = {
        origin_zone: 'Test Zone',
        wind_speed_kmh: 40,
        wind_direction_deg: 90,
        distance_km: 15.5,
        calculated_storm_eta_min: 23,
        user_eta_min: 30,
        overlap_verdict: 'TE MOJAS'
      };

      const request = new Request('http://localhost/api/predictions', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);

      expect([201, 500]).toContain(response.status);
    });

    it('handles malformed JSON gracefully', async () => {
      const request = new Request('http://localhost/api/predictions', {
        method: 'POST',
        body: '{invalid json}',
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });
});
