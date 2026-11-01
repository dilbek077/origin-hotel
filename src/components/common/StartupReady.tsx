import { useEffect } from 'react';

export default function StartupReady() {
  useEffect(() => {
    const loader = document.getElementById('startup-loader');
    if (!loader) return;
    const started = Number(loader.dataset.started) || performance.now();
    // Use the rendered page itself as the skeleton, preserving every breakpoint.
    loader.hidden = true;
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

