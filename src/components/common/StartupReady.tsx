import { useEffect } from 'react';

export default function StartupReady() {
  useEffect(() => {
    const loader = document.getElementById('startup-loader');
    if (!loader) return;
    const started = Number(loader.dataset.started) || performance.now();
    // Align the dedicated placeholders with the mounted page without exposing it.
    const sections = [
      ['--sk-header', '.shilla-header-top'],
      ['--sk-nav', '.shilla-primary-nav'],
      ['--sk-booking', '.shilla-reservation'],
      ['--sk-hero', '.shilla-hero'],
    ] as const;
    for (const [property, selector] of sections) {
      const element = document.querySelector(selector);
      if (element) loader.style.setProperty(property, `${element.getBoundingClientRect().height}px`);
    }
    // Keep the skeleton visible for two seconds, even on a cached connection.
    const timer = window.setTimeout(() => {
      loader.remove();
      const root = document.getElementById('root');
      root?.removeAttribute('data-loading');
      root?.removeAttribute('aria-hidden');
      root?.removeAttribute('inert');
    }, Math.max(0, 2000 - (performance.now() - started)));
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}

