import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { AppRouter } from './AppRouter.js';

// Mocked at the module seam: vi.stubEnv does not reach lib/local-only.ts's own
// import.meta.env under Vite (see App.test.tsx).
const localOnly = vi.hoisted(() => ({ on: false }));
vi.mock('./lib/local-only.js', () => ({ isLocalOnlyBuild: () => localOnly.on }));

function Probe() {
  return (
    <Routes>
      <Route path="/from-hash" element={<p>hash route</p>} />
      <Route path="/from-path" element={<p>path route</p>} />
      <Route path="*" element={<p>no match</p>} />
    </Routes>
  );
}

describe('AppRouter', () => {
  afterEach(() => {
    localOnly.on = false;
    window.history.replaceState(null, '', '/');
  });

  it('routes a local-only build from the URL hash, whatever the path is', () => {
    localOnly.on = true;
    // A deep folder on a static web server: the path must not matter.
    window.history.replaceState(null, '', '/~opettaja/provenance/index.html#/from-hash');
    render(
      <AppRouter>
        <Probe />
      </AppRouter>,
    );
    expect(screen.getByText('hash route')).toBeInTheDocument();
  });

  it('routes the server-backed build from the URL path', () => {
    window.history.replaceState(null, '', '/from-path#/from-hash');
    render(
      <AppRouter>
        <Probe />
      </AppRouter>,
    );
    expect(screen.getByText('path route')).toBeInTheDocument();
  });
});
