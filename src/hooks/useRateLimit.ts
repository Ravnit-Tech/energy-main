import { useRef, useState, useCallback } from "react";

interface RateLimitOptions {
  maxAttempts: number;  // max submissions in the window
  windowMs: number;     // rolling window in ms
}

interface RateLimitResult {
  attempt: () => boolean;   // returns true if allowed, false if blocked
  isBlocked: boolean;
  remainingMs: number;       // ms until next slot opens
  attemptsLeft: number;
}

// In-memory rate limiter — tracks timestamps of recent attempts.
// No localStorage so it resets on page refresh (intentional for UX).
export function useRateLimit({ maxAttempts, windowMs }: RateLimitOptions): RateLimitResult {
  const timestamps = useRef<number[]>([]);
  const [, forceRender] = useState(0);

  const prune = () => {
    const cutoff = Date.now() - windowMs;
    timestamps.current = timestamps.current.filter((t) => t > cutoff);
  };

  const attempt = useCallback((): boolean => {
    prune();
    if (timestamps.current.length >= maxAttempts) {
      forceRender((n) => n + 1);
      return false;
    }
    timestamps.current.push(Date.now());
    forceRender((n) => n + 1);
    return true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAttempts, windowMs]);

  prune();
  const isBlocked = timestamps.current.length >= maxAttempts;
  const oldest = timestamps.current[0] ?? 0;
  const remainingMs = isBlocked ? Math.max(0, oldest + windowMs - Date.now()) : 0;

  return {
    attempt,
    isBlocked,
    remainingMs,
    attemptsLeft: Math.max(0, maxAttempts - timestamps.current.length),
  };
}
