'use client';

import { useEffect } from 'react';
import { initZarazDevMock, resetConsent } from './zaraz-dev-mock';

/**
 * Injects a mock Zaraz Consent API in development mode.
 * Renders nothing — just a side-effect component.
 */
export function ZarazDevMock() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    initZarazDevMock();

    // Expose reset helper on window for easy console testing
    (window as any).__resetConsent = resetConsent;

    return () => {
      delete (window as any).__resetConsent;
    };
  }, []);

  return null;
}
