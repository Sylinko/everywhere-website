'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ZarazConsent {
  modal: boolean;
  purposes: Record<string, { id: string; name: string; description: string; order: number }>;
  APIReady: boolean;
  get(purposeId: string): boolean | undefined;
  set(consentPreferences: Record<string, boolean>): void;
  getAll(): Record<string, boolean>;
  setAll(consentStatus: boolean): void;
  getAllCheckboxes(): Record<string, boolean>;
  setCheckboxes(checkboxesStatus: Record<string, boolean>): void;
  setAllCheckboxes(checkboxStatus: boolean): void;
  sendQueuedEvents(): void;
}

interface ZarazGlobal {
  consent: ZarazConsent;
}

declare global {
  interface Window {
    zaraz?: ZarazGlobal;
  }
}

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export interface ConsentState {
  /** Whether the Zaraz Consent API is ready */
  apiReady: boolean;
  /** Current consent status: pending (no choice yet), accepted, or rejected */
  status: ConsentStatus;
  /** Per-purpose consent map */
  purposes: Record<string, boolean>;
  /** All configured purpose metadata */
  purposeMeta: Record<string, { id: string; name: string; description: string; order: number }>;
  /** Whether the toast should be shown (new user, no choice made) */
  showToast: boolean;
  /** Whether the settings dialog is open */
  dialogOpen: boolean;
}

export interface ConsentActions {
  /** Accept all purposes */
  acceptAll: () => void;
  /** Reject all purposes */
  rejectAll: () => void;
  /** Save specific preferences */
  savePreferences: (preferences: Record<string, boolean>) => void;
  /** Open the settings dialog */
  openDialog: () => void;
  /** Close the settings dialog */
  closeDialog: () => void;
  /** Dismiss the toast without making a choice */
  dismissToast: () => void;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  return value?.split(`; ${name}=`)[1]?.split(';')[0];
}

function hasExistingConsent(): boolean {
  return getCookie('cf_consent') !== undefined;
}

function resolveLocalized(value: unknown, lang: string): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const map = value as Record<string, string>;
    if (map[lang]) return map[lang];
    const prefix = lang.split('-')[0];
    const prefixMatch = Object.keys(map).find((k) => k.startsWith(prefix));
    if (prefixMatch) return map[prefixMatch];
    const first = Object.values(map)[0];
    return typeof first === 'string' ? first : '';
  }
  return String(value ?? '');
}

function normalizePurposeMeta(
  raw: unknown,
  lang: string,
): Record<string, { id: string; name: string; description: string; order: number }> {
  if (!raw || typeof raw !== 'object') return {};
  const result: Record<string, { id: string; name: string; description: string; order: number }> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (!val || typeof val !== 'object') continue;
    const entry = val as Record<string, unknown>;
    result[key] = {
      id: typeof entry.id === 'string' ? entry.id : key,
      name: resolveLocalized(entry.name, lang),
      description: resolveLocalized(entry.description, lang),
      order: typeof entry.order === 'number' ? entry.order : 0,
    };
  }
  return result;
}

export function useZarazConsent(lang: string): ConsentState & ConsentActions {
  const [apiReady, setApiReady] = useState(false);
  const [status, setStatus] = useState<ConsentStatus>(() =>
    hasExistingConsent() ? 'accepted' : 'pending',
  );
  const [purposes, setPurposes] = useState<Record<string, boolean>>({});
  const [purposeMeta, setPurposeMeta] = useState<
    Record<string, { id: string; name: string; description: string; order: number }>
  >({});
  const [showToast, setShowToast] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const initialized = useRef(false);

  // Initialize when Zaraz API is ready
  useEffect(() => {
    function initConsent() {
      const zaraz = window.zaraz?.consent;
      if (!zaraz) return;

      setApiReady(true);

      if (zaraz.purposes) {
        setPurposeMeta(normalizePurposeMeta(zaraz.purposes, lang));
      }

      const allConsent = zaraz.getAll();
      setPurposes(allConsent);

      if (hasExistingConsent()) {
        // User has already made a choice
        const allGranted = Object.values(allConsent).every(Boolean);
        setStatus(allGranted ? 'accepted' : 'rejected');
        setShowToast(false);
      } else {
        // New user — show toast
        setStatus('pending');
        setShowToast(true);
      }

      initialized.current = true;
    }

    // If API is already ready
    if (window.zaraz?.consent?.APIReady) {
      initConsent();
      return;
    }

    // Wait for API ready event
    const handler = () => initConsent();
    document.addEventListener('zarazConsentAPIReady', handler);
    return () => document.removeEventListener('zarazConsentAPIReady', handler);
  }, []);

  // Listen for consent changes from other sources
  useEffect(() => {
    if (!apiReady) return;

    const handler = () => {
      const zaraz = window.zaraz?.consent;
      if (!zaraz) return;
      const allConsent = zaraz.getAll();
      setPurposes(allConsent);
    };

    document.addEventListener('zarazConsentChoicesUpdated', handler);
    return () => document.removeEventListener('zarazConsentChoicesUpdated', handler);
  }, [apiReady]);

  const acceptAll = useCallback(() => {
    const zaraz = window.zaraz?.consent;
    if (!zaraz) return;
    zaraz.setAll(true);
    zaraz.sendQueuedEvents();
    setPurposes(zaraz.getAll());
    setStatus('accepted');
    setShowToast(false);
    setDialogOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    const zaraz = window.zaraz?.consent;
    if (!zaraz) return;
    zaraz.setAll(false);
    setPurposes(zaraz.getAll());
    setStatus('rejected');
    setShowToast(false);
    setDialogOpen(false);
  }, []);

  const savePreferences = useCallback(
    (preferences: Record<string, boolean>) => {
      const zaraz = window.zaraz?.consent;
      if (!zaraz) return;
      zaraz.set(preferences);
      // If any purpose was granted, send queued events
      if (Object.values(preferences).some(Boolean)) {
        zaraz.sendQueuedEvents();
      }
      setPurposes(zaraz.getAll());
      const allGranted = Object.values(zaraz.getAll()).every(Boolean);
      setStatus(allGranted ? 'accepted' : 'rejected');
      setShowToast(false);
      setDialogOpen(false);
    },
    [],
  );

  const openDialog = useCallback(() => {
    setDialogOpen(true);
    setShowToast(false);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const dismissToast = useCallback(() => {
    setShowToast(false);
  }, []);

  return {
    apiReady,
    status,
    purposes,
    purposeMeta,
    showToast,
    dialogOpen,
    acceptAll,
    rejectAll,
    savePreferences,
    openDialog,
    closeDialog,
    dismissToast,
  };
}
