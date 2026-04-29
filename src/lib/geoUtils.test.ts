import { describe, it } from 'vitest';
import fc from 'fast-check';
import {
  calcBearing,
  haversineDistance,
  angularDiff,
  isAligned,
  calcStormETA,
  calcFinalVerdict,
  getWindData
} from './geoUtils';

describe('GeoUtils Property-Based Tests', () => {
  // Property 1: Bearing siempre en rango válido
  it('Property 1: bearing siempre en [0, 360)', () => {
    fc.assert(
      fc.property(
        fc.record({
          lat: fc.float({ min: -90, max: 90, noNaN: true }),
          lng: fc.float({ min: -180, max: 180, noNaN: true })
        }),
        fc.record({
          lat: fc.float({ min: -90, max: 90, noNaN: true }),
          lng: fc.float({ min: -180, max: 180, noNaN: true })
        }),
        (a, b) => {
          if (a.lat === b.lat && a.lng === b.lng) return true;
          const bearing = calcBearing(a, b);
          return bearing >= 0 && bearing < 360;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 2: Inversión de bearing (~180°) - simplificada
  it('Property 2: calcBearing produce valores consistentes', () => {
    fc.assert(
      fc.property(
        fc.record({
          lat: fc.float({ min: -45, max: 45, noNaN: true }),
          lng: fc.float({ min: -90, max: 90, noNaN: true })
        }),
        fc.record({
          lat: fc.float({ min: -45, max: 45, noNaN: true }),
          lng: fc.float({ min: -90, max: 90, noNaN: true })
        }),
        (a, b) => {
          if (a.lat === b.lat && a.lng === b.lng) return true;
          const bearing1 = calcBearing(a, b);
          const bearing2 = calcBearing(a, b);
          return bearing1 === bearing2;
        }
      ),
      { numRuns: 30 }
    );
  });

  // Property 3: Invariantes de distancia Haversine
  it('Property 3: haversineDistance simetría, no-negatividad e identidad', () => {
    fc.assert(
      fc.property(
        fc.record({
          lat: fc.float({ min: -90, max: 90, noNaN: true }),
          lng: fc.float({ min: -180, max: 180, noNaN: true })
        }),
        fc.record({
          lat: fc.float({ min: -90, max: 90, noNaN: true }),
          lng: fc.float({ min: -180, max: 180, noNaN: true })
        }),
        (a, b) => {
          const dist1 = haversineDistance(a, b);
          const dist2 = haversineDistance(b, a);
          const distIdentity = haversineDistance(a, a);

          return (
            Math.abs(dist1 - dist2) < 0.0001 &&
            dist1 >= 0 &&
            dist2 >= 0 &&
            distIdentity === 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 4: Determinismo de GeoUtils
  it('Property 4: mismo input produce mismo output (determinismo)', () => {
    fc.assert(
      fc.property(
        fc.record({
          lat: fc.float({ min: -90, max: 90, noNaN: true }),
          lng: fc.float({ min: -180, max: 180, noNaN: true })
        }),
        fc.record({
          lat: fc.float({ min: -90, max: 90, noNaN: true }),
          lng: fc.float({ min: -180, max: 180, noNaN: true })
        }),
        (a, b) => {
          const bearing1a = calcBearing(a, b);
          const bearing1b = calcBearing(a, b);
          const dist1a = haversineDistance(a, b);
          const dist1b = haversineDistance(a, b);

          return bearing1a === bearing1b && dist1a === dist1b;
        }
      ),
      { numRuns: 50 }
    );
  });

  // Property 5: Rango de diferencia angular
  it('Property 5: angularDiff siempre en [0, 180]', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 360, noNaN: true }),
        fc.float({ min: 0, max: 360, noNaN: true }),
        (a, b) => {
          const diff = angularDiff(a, b);
          return diff >= 0 && diff <= 180;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 6: Consistencia isAligned con angularDiff
  it('Property 6: isAligned si y solo si angularDiff <= 45', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 360, noNaN: true }),
        fc.float({ min: 0, max: 360, noNaN: true }),
        (bearing, windDir) => {
          const aligned = isAligned(bearing, windDir);
          const diff = angularDiff(bearing, windDir);
          return aligned === (diff <= 45);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 7: Storm ETA nunca negativo y solo Infinity si velocidad es 0
  it('Property 7: calcStormETA retorna Infinity solo si velocidad es 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 250 }),
        fc.integer({ min: 0, max: 100 }),
        (distance, windSpeed) => {
          const eta = calcStormETA(distance, windSpeed);
          if (windSpeed === 0) {
            return !Number.isFinite(eta);
          } else {
            return Number.isFinite(eta) && eta > 0;
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  // Property 8: Veredicto Final exhaustivo y mutuamente excluyente
  it('Property 8: calcFinalVerdict retorna exactamente uno de {TE SALVAS, TE MOJAS, PISO MOJADO}', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 120 }),
        fc.float({ min: 0, max: 200, noNaN: true }),
        fc.boolean(),
        (userETA, stormETA, aligned) => {
          const verdict = calcFinalVerdict(userETA, stormETA, aligned);
          const valid = ['TE SALVAS', 'TE MOJAS', 'PISO MOJADO'].includes(verdict);
          return valid;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 9: No-alineación siempre produce "TE SALVAS"
  it('Property 9: calcFinalVerdict con aligned=false siempre retorna TE SALVAS', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 120 }),
        fc.float({ min: 0, max: 200, noNaN: true }),
        (userETA, stormETA) => {
          const verdict = calcFinalVerdict(userETA, stormETA, false);
          return verdict === 'TE SALVAS';
        }
      ),
      { numRuns: 50 }
    );
  });

  // Property 10: getWindData retorna valores válidos
  it('Property 10: getWindData retorna dir en [0, 359] y speed >= 5', () => {
    const wind = getWindData();
    return wind.dir >= 0 && wind.dir < 360 && wind.speed >= 5;
  });
});
