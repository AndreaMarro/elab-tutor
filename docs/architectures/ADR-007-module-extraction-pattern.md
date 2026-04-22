# ADR-007: Module Extraction Pattern for Deno + Node Shared Logic

- **Status**: Accepted
- **Date**: 2026-04-22 (Sprint 4 Day 06 / cumulative Day 27)
- **Authors**: Andrea Marro + Harness 2.0 workflow
- **Supersedes**: none
- **Superseded by**: none
- **Related**: ADR-006 (Karpathy LLM Wiki three-layer), ADR-001 (Supabase ref canonicalization)

## Context

The ELAB Tutor backend splits across two JavaScript runtimes:

1. **Supabase Edge Functions** run on **Deno** (e.g. `supabase/functions/unlim-wiki-query/index.ts`)
2. **Benchmarks, dispatchers, scripts, and vitest** run on **Node** (e.g. `scripts/benchmark.cjs`, `scripts/wiki-build-batch-input.mjs`, `tests/**/*.test.js`)

When logic must be **identical across both runtimes** (request validation, retrieval scoring, metric computation), copy-pasting invites drift. Re-implementing diverges silently.

Sprint 4 surfaced the pattern twice in a single day:
- Day 26 **S4.1.5**: `wiki-query-core.mjs` extracted from an Edge Function scaffold, imported by both `supabase/functions/unlim-wiki-query/index.ts` (Deno) and `tests/unit/wiki-query-core.test.js` (Node/vitest).
- Day 26 **S4.2.2**: `scripts/benchmark-metrics/accessibility.cjs` extracted from the 700-line `scripts/benchmark.cjs` monolith, imported by `scripts/benchmark.cjs` and `tests/unit/benchmark-accessibility.test.js`.

Both extractions reduced the blast radius of changes, unlocked unit-test-first development, and halved the time-to-red-test for new edge cases. The pattern is repeatable and deserves a canonical form before it appears a third time.

## Decision

**Extract shared cross-runtime logic into a pure-ESM (or pure-CJS where CJS-only) module under `scripts/` or `scripts/benchmark-metrics/` with zero runtime npm dependencies.**

Concretely:

1. **File extension drives loader mode**:
   - `.mjs` → native ESM, preferred for new modules. Imported in Deno Edge Functions via relative path (`import { x } from '../../../scripts/foo.mjs'`) and in Node via `import`.
   - `.cjs` → required only when the consumer is an existing CommonJS monolith (like `benchmark.cjs`). Tests load it via `createRequire(import.meta.url)` inside ESM test files.
2. **No runtime npm dependencies**. `package.json` dependencies must not be imported by extracted modules. `devDependencies` are forbidden at runtime even under `process.env.NODE_ENV === 'test'`. Node built-ins (`fs`, `path`, `url`) are allowed but scoped via `node:` prefix for Deno compatibility where feasible.
3. **Export a factory when the module has config**. E.g. `makeRetriever(corpus)` instead of a bare function that closes over a module-scope constant. This is the key to unit-testability and corpus swapping.
4. **Keep a default export or module-level default constant** when the extraction replaces an inline value (e.g. `SEED_CORPUS`) — preserves back-compat for callers during migration.
5. **Unit tests live at `tests/unit/<module-slug>.test.js`** and are the *primary* acceptance gate. Integration tests (`tests/integration/`) cover pipeline round-trips separately.
6. **Each extraction ships with its own `@typedef` JSDoc block** until the project adopts TypeScript. The block documents the shape at the boundary where Deno and Node meet.
7. **Direct-run detection when the module is also a CLI**: use `fileURLToPath(import.meta.url)` compared against `process.argv[1]` (handles paths with spaces, unlike the naive `import.meta.url === `file://${argv[1]}`` check that bit us on Day 24).

## Consequences

### Positive

- **Testability**: pure modules are instantly unit-testable without booting Deno or spinning a Supabase local env.
- **Speed**: vitest runs a unit test in ~5 ms; the same logic tested through an Edge Function integration loop is 2+ s.
- **Portability**: the same module powers CLI scripts, benchmarks, Edge Functions, and future workers without transpilation.
- **No bundler**: Deno resolves relative imports at runtime. Node does the same. No Vite/Rollup pipeline entering the path.
- **Single source of truth**: when retrieval scoring changes, one file edit propagates to both runtimes atomically.
- **Refactor confidence**: extracted modules have locked-in unit tests that catch accidental behaviour changes during downstream integration work.

### Negative

- **Type drift**: without TypeScript, JSDoc `@typedef` annotations drift from reality if not maintained. Mitigation: code review checklist item "JSDoc block matches exported shape". Long-term: migrate `scripts/*.mjs` to `.ts` when Deno+Node dual-runtime TS compilation stabilises (tracked in backlog).
- **Import path rigidity**: relative paths from `supabase/functions/**/index.ts` to `scripts/*.mjs` are long (`../../../scripts/foo.mjs`). Symlinks or Deno import maps could shorten them; deferred until 5+ Edge Functions exist.
- **Perceived duplication with `src/`**: some logic could live in `src/` under React-world but would then require bundling for Deno. We accept the dual location: `src/` for browser-consumed code, `scripts/` for Node+Deno-consumed code.
- **Discovery cost**: new contributors must learn the convention. Mitigation: this ADR + future `CONTRIBUTING.md` pointer.

## Examples (precedent)

| Module | Runtime consumers | Unit tests | Extracted from |
|---|---|---|---|
| `scripts/wiki-query-core.mjs` | Deno Edge Function `unlim-wiki-query`, Node vitest | `tests/unit/wiki-query-core.test.js` (24 cases) | Inline scaffold Day 26 |
| `scripts/benchmark-metrics/accessibility.cjs` | `scripts/benchmark.cjs` monolith, Node vitest | `tests/unit/benchmark-accessibility.test.js` (12 cases) | Benchmark monolith Day 26 |
| `scripts/wiki-build-batch-input.mjs` | Node CLI + vitest | `tests/unit/wiki-build-batch-input.test.js` (13 cases) | Day 24 Together batch builder |
| `scripts/wiki-corpus-loader.mjs` (Day 27) | Node loader + vitest (eventual Deno Edge Function consumer) | `tests/unit/wiki-corpus-loader.test.js` (18 cases) | This sprint |

## Anti-Patterns (DO NOT)

- ❌ Import heavy npm package in an extracted module (e.g. `marked`, `date-fns`). If you need one, keep the logic in the Node-only caller and abstract the interface.
- ❌ Use CommonJS `require()` inside a `.mjs` file. Use `createRequire(import.meta.url)` explicitly when interop is unavoidable.
- ❌ Rely on module-level mutable state for request-scoped config. Return factories.
- ❌ Export both ESM default and named bindings for the *same* thing — pick one.
- ❌ Use `__dirname` / `__filename` — not available in ESM. Derive from `import.meta.url`.
- ❌ Assume process.env is shared — Deno reads env differently. Pass env through function args.

## Validation & Adoption

- [x] Day 26 precedent: 2 successful extractions, 36 unit tests green, zero regressions.
- [ ] Day 27 story `wiki-corpus-loader.mjs` applies the pattern from scratch (unit tests written before integration wiring).
- [ ] Sprint 5+ new Edge Functions are required to follow this ADR unless a waiver is documented in the Sprint Contract.

## References

- Day 26 commit `f7a8be5` — `feat(sett-4-day-05): unlim-wiki-query scaffold + a11y metric wire + axe-baseline generator`
- [ADR-006 — Karpathy LLM Wiki three-layer architecture](./ADR-006-karpathy-llm-wiki-three-layer.md)
- [docs/unlim-wiki/SCHEMA.md](../unlim-wiki/SCHEMA.md)
