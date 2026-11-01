import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LanguageProvider } from './i18n';
import { ThemeProvider } from './theme';
import './hotel-theme.css';

function StartupReady() {
  useEffect(() => {
    const loader = document.getElementById('startup-loader');
    if (!loader) return;
    const started = Number(loader.dataset.started) || performance.now();
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <StartupReady />
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
