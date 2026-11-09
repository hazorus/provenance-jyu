/**
 * Local-only build switch.
 *
 * A build made with `VITE_LOCAL_ONLY=true` serves ONLY the in-browser `/local`
 * subtree, with no login and no staff check, and redirects every other path to
 * `/local/load`. It is meant to run on a staff member's own machine (e.g.
 * `vite preview` on localhost), where the analysis never leaves the browser and
 * there is no server to sign in to.
 *
 * The staff gate on `/local` (analyzer PRD §15, amended 2026-07-10) exists
 * because a hosted deployment would otherwise let any account on the allowed
 * domain — every student — run bundles through the analyzer. That threat needs
 * a shared, reachable deployment; a build that only ever runs on the reviewer's
 * own machine has none. The default build (variable unset or anything other
 * than the exact string `true`) is unchanged and stays gated.
 *
 * Read at call time rather than at module load. Tests mock this module at its
 * seam (see App.test.tsx): `vi.stubEnv` does not reach another module's
 * `import.meta.env` under Vite. The parsing rule itself is
 * {@link localOnlyFromEnv}, tested directly.
 */
export function isLocalOnlyBuild(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Vite injects import.meta.env at build time; type is `any` via Vite's glob typing
  const env = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) as Record<
    string,
    string | undefined
  >;
  return localOnlyFromEnv(env);
}

/** Only the exact string `true` turns the gate off; anything else keeps it. */
export function localOnlyFromEnv(env: Readonly<Record<string, string | undefined>>): boolean {
  return env['VITE_LOCAL_ONLY'] === 'true';
}
