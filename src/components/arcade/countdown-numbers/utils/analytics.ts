declare global {
  function plausible(eventName: string, options?: { props?: Record<string, string> }): void;
}

export function trackRegenerate() {
  window.plausible?.('Countdown: Regenerate');
}

export function trackRevealSolution() {
  window.plausible?.('Countdown: Reveal Solution');
}
