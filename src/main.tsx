import StartupReady from '@/components/common/StartupReady';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LanguageProvider } from './i18n';
import { ThemeProvider } from './theme';
import './hotel-theme.css';

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
