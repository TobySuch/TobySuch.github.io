declare global {
  function plausible(eventName: string, options?: { props?: Record<string, string> }): void;
}

export function trackReveal(dailyNumber: number) {
  window.plausible?.('NOTD: Reveal Answers', { props: { number: String(dailyNumber) } });
}
