/**
 * The router the app runs under.
 *
 * The server-backed build uses BrowserRouter: it is served from the domain
 * root and the server answers every client route with index.html.
 *
 * A VITE_LOCAL_ONLY build uses HashRouter (`index.html#/local/load`). That
 * build is plain static files meant to be dropped into ANY folder of ANY web
 * server (e.g. an Apache user directory) with no rewrite rules: the path part
 * of the URL never changes, so a reload or a bookmarked deep link always asks
 * the server for the folder's index.html, and the relative asset base
 * (`base: './'` in vite.config.ts for that mode) resolves against that folder.
 */
import type { ReactNode } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { isLocalOnlyBuild } from './lib/local-only.js';

export function AppRouter({ children }: { children: ReactNode }) {
  return isLocalOnlyBuild() ? (
    <HashRouter>{children}</HashRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );
}
