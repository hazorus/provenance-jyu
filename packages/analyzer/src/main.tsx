import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App.js';
import { AppRouter } from './AppRouter.js';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time 0 by default — individual query hooks set their own staleTime.
      staleTime: 0,
      // Retry twice on error, but individual hooks may override.
      retry: 2,
    },
  },
});

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <AppRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AppRouter>
  </React.StrictMode>,
);
