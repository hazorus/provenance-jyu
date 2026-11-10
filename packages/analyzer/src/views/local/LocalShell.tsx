/**
 * LocalShell — layout wrapper for the /local/* subtree.
 *
 * The /local routes are the v2 "drop a zip" standalone experience. The
 * analysis itself runs entirely in-browser — no server API calls — but the
 * subtree is staff-gated (see below), so it is not unauthenticated.
 *
 * /local is now staff-gated — see App.tsx, where the subtree is wrapped in
 * RequireAuth + RequireStaff (PRD §15 amended 2026-07-10).
 *
 * Layout:
 *   <LocalShell>
 *     ┌────────────────────────────────────────────────────────────────────────┐
 *     │  LOCAL MODE BANNER                                                     │
 *     ├────────────────────────────────────────────────────────────────────────┤
 *     │  <BundleProvider> wraps <Outlet /> (load / overview / timeline etc.)  │
 *     └────────────────────────────────────────────────────────────────────────┘
 */

import { BundleProvider, useBundle } from '../../context/BundleContext.js';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { isLocalOnlyBuild } from '../../lib/local-only.js';

// ---------------------------------------------------------------------------
// Bundle guards (same semantics as App.tsx, adapted for /local prefix)
// ---------------------------------------------------------------------------

/** Redirects to /local/load if no bundle is loaded. */
export function RequireLocalBundle({ children }: { children: ReactNode }) {
  const { status } = useBundle();
  if (status !== 'loaded') {
    return <Navigate to="/local/load" replace />;
  }
  return <>{children}</>;
}

/**
 * Redirects to /local/load if fewer than two bundles are loaded.
 * If exactly one bundle is loaded, redirects to /local/overview so the user
 * sees something useful.
 */
export function RequireLocalMultiBundles({ children }: { children: ReactNode }) {
  const { status, bundles } = useBundle();
  if (status !== 'loaded') {
    return <Navigate to="/local/load" replace />;
  }
  if (bundles.length < 2) {
    return <Navigate to="/local/overview" replace />;
  }
  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

function LocalModeBanner() {
  return (
    <div
      className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-center text-sm text-blue-700"
      role="banner"
      data-testid="local-mode-banner"
    >
      <span className="font-medium">Local mode</span> — no data leaves your browser
    </div>
  );
}

// ---------------------------------------------------------------------------
// Local-only navigation
// ---------------------------------------------------------------------------

/**
 * Tabs between the two pages a VITE_LOCAL_ONLY build serves: bundle analysis
 * (/local) and the manifest composer (/compose/manifest). Both run entirely in
 * the browser. The gated build reaches the composer through AppShell instead,
 * which needs the server (`useMe`), so this bar renders only in a local-only
 * build.
 */
export function LocalOnlyNav() {
  const tab = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md text-sm ${
      isActive ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600 hover:text-gray-900'
    }`;
  return (
    <nav
      aria-label="Local tools"
      data-testid="local-only-nav"
      className="flex gap-2 border-b border-gray-200 px-4 py-2"
    >
      <NavLink to="/local" className={tab}>
        Analyze bundles
      </NavLink>
      <NavLink to="/compose/manifest" className={tab}>
        Compose manifest
      </NavLink>
    </nav>
  );
}

/**
 * Frame for /compose/manifest in a VITE_LOCAL_ONLY build: the local-mode
 * banner and the tab bar, without AppShell (which needs the server). The
 * composer reads the signing key only inside its sign handler and never sends
 * it anywhere (see ManifestComposerView.tsx), so the banner's promise holds.
 */
export function LocalOnlyComposerShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <LocalModeBanner />
      <LocalOnlyNav />
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LocalShell
// ---------------------------------------------------------------------------

/**
 * Top-level layout component for the /local subtree.
 *
 * Wraps all /local/* routes in <BundleProvider> so the existing v2 route
 * elements (LoadView, OverviewView, etc.) have access to BundleContext.
 * Auth is enforced one level up in App.tsx (RequireAuth + RequireStaff wrap
 * this subtree), except in a VITE_LOCAL_ONLY build, which has no gate and no
 * server (lib/local-only.ts).
 */
export function LocalShell() {
  return (
    <BundleProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <LocalModeBanner />
        {isLocalOnlyBuild() && <LocalOnlyNav />}
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </div>
    </BundleProvider>
  );
}
