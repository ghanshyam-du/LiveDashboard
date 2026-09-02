'use client';

import { useKeepAlive } from '@/lib/useKeepAlive';

/**
 * Invisible component mounted at the root layout.
 * Its only job is to keep the Render backend warm via the useKeepAlive hook.
 */
export default function KeepAlive() {
  useKeepAlive();
  return null;
}
