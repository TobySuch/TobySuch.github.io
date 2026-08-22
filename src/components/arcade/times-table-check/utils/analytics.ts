declare global {
  function plausible(eventName: string, options?: { props?: Record<string, string> }): void;
}

export function trackRegenerate() {
  window.plausible?.('TimesTableCheck: Regenerate');
}

export function trackRevealCell() {
  window.plausible?.('TimesTableCheck: Reveal Cell');
}
