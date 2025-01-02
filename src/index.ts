import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import './css/index.css'

// Wait for the DOM to be ready
const renderApp = (): void => {
  const container = document.getElementById('app');

  if (!container) {
    console.error('Container element not found');
    return;
  }

  const root = ReactDOM.createRoot(container as HTMLElement);
  root.render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(App)
    )
  );
};

// Initialize app based on environment
const initializeApp = (): void => {
  // Check if document is already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderApp();
  } else {
    document.addEventListener('DOMContentLoaded', renderApp);
  }
};

// Handle both Cordova and browser environments
if ((window as any).cordova) {
  document.addEventListener('deviceready', initializeApp, false);
} else {
  initializeApp();
}
