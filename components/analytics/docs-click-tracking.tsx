'use client';

import { useEffect } from 'react';
import {
  classifyTrackingTarget,
  isDocsEventName,
  trackDocsEvent,
  type DocsEventName,
  type DocsEventProperties,
} from '@/lib/analytics';

const customDataPrefix = 'trackParam';

export function DocsClickTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest<HTMLElement>(
        'a,button,[data-track-event]',
      );
      if (!element) return;

      const explicitEvent = element.dataset.trackEvent?.trim();
      const href = getElementHref(element);
      const classified = explicitEvent
        ? null
        : href
          ? classifyTrackingTarget(href)
          : null;
      const eventName = explicitEvent ?? classified?.eventName;

      if (!eventName) return;

      if (!isDocsEventName(eventName)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Docs Analytics] Unknown event: ${eventName}`);
        }
        return;
      }

      trackDocsEvent(eventName, {
        section: element.dataset.trackSection ?? 'unknown',
        link_url: href,
        link_text: getElementText(element),
        ...getCustomProperties(element),
      });
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
    };
  }, []);

  return null;
}

function getElementHref(element: HTMLElement): string | undefined {
  if (element instanceof HTMLAnchorElement) return element.href;

  const nestedLink = element.querySelector<HTMLAnchorElement>('a[href]');
  return nestedLink?.href;
}

function getElementText(element: HTMLElement): string | undefined {
  const ariaLabel = element.getAttribute('aria-label');
  const title = element.getAttribute('title');
  const text = element.textContent?.trim().replace(/\s+/g, ' ');

  return (ariaLabel || title || text || undefined)?.slice(0, 120);
}

function getCustomProperties(element: HTMLElement): DocsEventProperties {
  const result: DocsEventProperties = {};

  for (const [key, value] of Object.entries(element.dataset)) {
    if (!key.startsWith(customDataPrefix) || value === undefined) continue;

    const propertyName = key
      .slice(customDataPrefix.length)
      .replace(/^[A-Z]/, (char) => char.toLowerCase())
      .replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

    if (propertyName) {
      result[propertyName] = value;
    }
  }

  return result;
}

export type { DocsEventName };
