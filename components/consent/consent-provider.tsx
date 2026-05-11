'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useZarazConsent, type ConsentState, type ConsentActions } from './use-zaraz-consent';
import { ConsentToast } from './consent-toast';
import { ConsentSettingsDialog } from './consent-settings-dialog';
import { consentTranslations, type ConsentTranslation } from './translations';
import { ZarazDevMock } from './zaraz-dev-mock-provider';

interface ConsentContextValue extends ConsentState, ConsentActions {
  translation: ConsentTranslation;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return ctx;
}

interface ConsentProviderProps {
  children: ReactNode;
  lang: string;
}

export function ConsentProvider({ children, lang }: ConsentProviderProps) {
  const consent = useZarazConsent(lang);
  const translation = consentTranslations[lang] ?? consentTranslations['en'];

  const contextValue: ConsentContextValue = {
    ...consent,
    translation,
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {/* Dev mock must render before children so its effect fires first */}
      <ZarazDevMock />
      {children}

      {/* Toast — bottom-right for new users */}
      <ConsentToast
        visible={consent.showToast}
        translation={translation.toast}
        lang={lang}
        onAccept={consent.acceptAll}
        onSettings={consent.openDialog}
      />

      {/* Settings dialog — triggered from toast or footer */}
      <ConsentSettingsDialog
        open={consent.dialogOpen}
        translation={translation.dialog}
        purposes={consent.purposes}
        purposeMeta={consent.purposeMeta}
        onAcceptAll={consent.acceptAll}
        onRejectAll={consent.rejectAll}
        onSave={consent.savePreferences}
        onClose={consent.closeDialog}
      />
    </ConsentContext.Provider>
  );
}
