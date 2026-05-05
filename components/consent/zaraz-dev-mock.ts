/**
 * Dev-only mock for the Cloudflare Zaraz Consent API.
 *
 * Simulates `window.zaraz.consent` so the consent toast & settings dialog
 * can be tested locally without deploying to Cloudflare.
 *
 * State is persisted in localStorage under `__zaraz_dev_consent__` so you can
 * refresh the page and see the "returning user" vs "new user" behaviour.
 *
 * Inject this script via a <Script> tag in the root layout (dev only).
 */

const STORAGE_KEY = '__zaraz_dev_consent__';
const COOKIE_NAME = 'cf_consent';

// ── Purposes that mirror your Zaraz dashboard config ─────────────────────

const PURPOSES: Record<string, { id: string; name: string; description: string; order: number }> = {
  analytics: {
    id: 'analytics',
    name: 'Analytics & Performance',
    description:
      'These cookies help us understand how visitors interact with our website by collecting anonymous information.',
    order: 1,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────

function loadState(): Record<string, boolean> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Also set the cf_consent cookie so `hasExistingConsent()` works
  const cookieVal = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${COOKIE_NAME}=${cookieVal};path=/;max-age=31536000;SameSite=Lax`;
}

function deleteCookie() {
  document.cookie = `${COOKIE_NAME}=;path=/;max-age=0`;
}

// ── Build the mock consent object ────────────────────────────────────────

function createMockConsent() {
  let consentState: Record<string, boolean> = loadState() ?? {};

  return {
    modal: false,

    purposes: PURPOSES,

    APIReady: true,

    get(purposeId: string): boolean | undefined {
      if (!(purposeId in PURPOSES)) return undefined;
      return consentState[purposeId] ?? false;
    },

    set(consentPreferences: Record<string, boolean>) {
      consentState = { ...consentState, ...consentPreferences };
      saveState(consentState);
      document.dispatchEvent(new CustomEvent('zarazConsentChoicesUpdated'));
    },

    getAll(): Record<string, boolean> {
      const result: Record<string, boolean> = {};
      for (const id of Object.keys(PURPOSES)) {
        result[id] = consentState[id] ?? false;
      }
      return result;
    },

    setAll(consentStatus: boolean) {
      for (const id of Object.keys(PURPOSES)) {
        consentState[id] = consentStatus;
      }
      saveState(consentState);
      document.dispatchEvent(new CustomEvent('zarazConsentChoicesUpdated'));
    },

    getAllCheckboxes(): Record<string, boolean> {
      return this.getAll();
    },

    setCheckboxes(checkboxesStatus: Record<string, boolean>) {
      this.set(checkboxesStatus);
    },

    setAllCheckboxes(checkboxStatus: boolean) {
      this.setAll(checkboxStatus);
    },

    sendQueuedEvents() {
      console.log('[Zaraz Dev Mock] sendQueuedEvents called — in production this would flush queued analytics events');
    },
  };
}

// ── Inject into window ───────────────────────────────────────────────────

export function initZarazDevMock() {
  if (typeof window === 'undefined') return;

  // Don't double-init if real Zaraz is present
  if (window.zaraz?.consent?.APIReady) {
    console.log('[Zaraz Dev Mock] Real Zaraz detected — skipping mock');
    return;
  }

  (window as any).zaraz = {
    consent: createMockConsent(),
  };

  console.log('[Zaraz Dev Mock] Injected mock consent API. Purposes:', Object.keys(PURPOSES));

  // Fire the ready event so the hook picks it up
  document.dispatchEvent(new CustomEvent('zarazConsentAPIReady'));
}

/**
 * Helper to reset consent state (useful during testing).
 * Call from browser console: `window.__resetConsent()`
 */
export function resetConsent() {
  localStorage.removeItem(STORAGE_KEY);
  deleteCookie();
  console.log('[Zaraz Dev Mock] Consent state cleared. Reload the page to see the toast again.');
}
