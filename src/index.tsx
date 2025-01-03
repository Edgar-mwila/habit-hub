import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import './css/index.css';
import { SettingsProvider } from './context/settings';

const renderApp = (): void => {
  const container = document.getElementById('app');

  if (!container) {
    console.error('Container element not found');
    return;
  }

  const root = ReactDOM.createRoot(container as HTMLElement);
  root.render(
    <React.StrictMode>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </React.StrictMode>
  );
};

const initializeApp = (): void => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderApp();
  } else {
    document.addEventListener('DOMContentLoaded', renderApp);
  }
};

if ((window as any).cordova) {
  document.addEventListener('deviceready', initializeApp, false);
} else {
  initializeApp();
}
