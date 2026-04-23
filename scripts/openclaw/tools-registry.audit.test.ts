import { describe, it, expect } from 'vitest';
import { OPENCLAW_TOOLS_REGISTRY, auditRegistry, resolveStatus } from './tools-registry.ts';
import { buildFullMockApi } from './__mocks__/elab-api-mock.ts';

describe('auditRegistry against mock __ELAB_API', () => {
  it('all live tools resolve to function on mock API', () => {
    const api = buildFullMockApi();
    const report = auditRegistry(api, OPENCLAW_TOOLS_REGISTRY);
    if (report.live_broken.length > 0) {
      console.error('Broken handlers:', JSON.stringify(report.live_broken, null, 2));
    }
    expect(report.live_broken).toEqual([]);
  });

  it('sum of (live_ok + todo + composite + broken) equals total', () => {
    const api = buildFullMockApi();
    const report = auditRegistry(api, OPENCLAW_TOOLS_REGISTRY);
    expect(report.live_ok + report.todo + report.composite + report.live_broken.length).toBe(report.total);
  });

  it('reports at least 1 composite tool (analyzeImage)', () => {
    const api = buildFullMockApi();
    const report = auditRegistry(api, OPENCLAW_TOOLS_REGISTRY);
    expect(report.composite).toBeGreaterThanOrEqual(1);
  });

  it('reports at least 9 todo_sett5 handlers (Sprint-5 baseline)', () => {
    const api = buildFullMockApi();
    const report = auditRegistry(api, OPENCLAW_TOOLS_REGISTRY);
    expect(report.todo).toBeGreaterThanOrEqual(9);
  });

  it('majority of tools are live (≥60% live_ok post-fix)', () => {
    const api = buildFullMockApi();
    const report = auditRegistry(api, OPENCLAW_TOOLS_REGISTRY);
    expect(report.live_ok / report.total).toBeGreaterThanOrEqual(0.6);
  });

  it('no live handler points to unlim.X when X is not in {highlightComponent, highlightPin, clearHighlights, serialWrite, getCircuitState}', () => {
    const realUnlimMethods = new Set(['highlightComponent', 'highlightPin', 'clearHighlights', 'serialWrite', 'getCircuitState']);
    const offenders: string[] = [];
    for (const spec of OPENCLAW_TOOLS_REGISTRY) {
      if (resolveStatus(spec) !== 'live') continue;
      if (!spec.handler.startsWith('unlim.')) continue;
      const method = spec.handler.slice('unlim.'.length);
      if (!realUnlimMethods.has(method)) {
        offenders.push(`${spec.name} → ${spec.handler}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
