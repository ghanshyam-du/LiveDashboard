'use client';

import { useEffect, useRef } from 'react';

const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes — Render free tier spins down after 15 min of inactivity

/**
 * Sends a lightweight GET to /api/health at a regular interval so the
 * Render free-tier instance never hits the 15-minute inactivity threshold.
 *
 * This hook is designed to be mounted once at the root layout level.
 */
export function useKeepAlive() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const healthUrl = `${apiBase}/api/health`;

    const ping = async () => {
      try {
        await fetch(healthUrl, {
          method: 'GET',
          // Avoid caching so the request always hits the server
          cache: 'no-store',
        });
        console.debug('[KeepAlive] Backend pinged successfully', new Date().toISOString());
      } catch (err) {
        // Non-fatal — the dashboard will show disconnected state naturally
        console.warn('[KeepAlive] Ping failed:', err);
      }
    };

    // Immediate ping on mount so we wake the server as fast as possible
    ping();

    timerRef.current = setInterval(ping, PING_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
}
