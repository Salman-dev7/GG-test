import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initDB } from './db.ts';
import { seedDatabase } from './db-seed.ts';

const start = async () => {
  console.log("Aura: Initializing application...");

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Aura: SW registered:', registration.scope);
      }).catch(err => {
        console.log('Aura: SW registration failed:', err);
      });
    });
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    initDB()
      .then(async () => {
        await seedDatabase();
        console.log("Aura: IndexedDB initialized and seeded.");
      })
      .catch(err => {
        console.warn("Aura: Database failed to initialize.", err);
      });

  } catch (err) {
    console.error("Aura: Failed to initialize React root:", err);
  }
};

start();