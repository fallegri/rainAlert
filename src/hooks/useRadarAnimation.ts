'use client';

import { useEffect, useRef, useState } from 'react';
import type { LatLng, Particle } from '../types';

interface UseRadarAnimationArgs {
  pointA: LatLng;
  windDir: number;
  isRunning: boolean;
}

export function useRadarAnimation({ pointA, windDir, isRunning }: UseRadarAnimationArgs) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const nextParticleId = useRef(1);
  const runningRef = useRef(isRunning);

  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      setParticles([]);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const directionRad = (windDir * Math.PI) / 180;
    const velocity = 0.00016;

    const tick = () => {
      setParticles((existing) => {
        const updated = existing
          .map((particle) => ({
            ...particle,
            lat: particle.lat + Math.cos(directionRad) * velocity,
            lng: particle.lng + Math.sin(directionRad) * velocity,
            opacity: Math.max(0, particle.opacity - 0.0015)
          }))
          .filter((particle) => particle.opacity > 0);

        if (Math.random() < 0.16) {
          updated.push({
            id: nextParticleId.current++,
            lat: pointA.lat,
            lng: pointA.lng,
            opacity: 0.9
          });
        }

        return updated;
      });

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, pointA.lat, pointA.lng, windDir]);

  const start = () => {
    runningRef.current = true;
  };

  const cancel = () => {
    runningRef.current = false;
    setParticles([]);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return {
    particles,
    start,
    cancel
  };
}
