/**
 * ELAB — Drawing persistence helpers for DrawingOverlay (SVG annotations on canvas).
 *
 * Each experiment gets its own storage slot so drawings do NOT bleed across experiments.
 * When no experimentId is supplied (e.g., sandbox / pre-selection), drawings are saved
 * under 'paths' to preserve backward compatibility with the original global key.
 *
 * Prefix: `elab-drawing-`
 *   - `elab-drawing-paths`           → legacy/default bucket when no expId
 *   - `elab-drawing-<experimentId>`  → per-experiment bucket
 *
 * Note: the WhiteboardOverlay (canvas raster + vector shapes) uses a different
 * scheme (`elab_wb_<id>`). This module is only for the lighter SVG DrawingOverlay.
 */

export const DRAWING_STORAGE_PREFIX = 'elab-drawing-';
const DEFAULT_SUFFIX = 'paths';

export function getDrawingStorageKey(experimentId) {
  const suffix = (typeof experimentId === 'string' && experimentId.length > 0)
    ? experimentId
    : DEFAULT_SUFFIX;
  return DRAWING_STORAGE_PREFIX + suffix;
}

export function loadDrawingPaths(experimentId) {
  try {
    const raw = localStorage.getItem(getDrawingStorageKey(experimentId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDrawingPaths(paths, experimentId) {
  try {
    localStorage.setItem(
      getDrawingStorageKey(experimentId),
      JSON.stringify(Array.isArray(paths) ? paths : [])
    );
  } catch {
    /* quota exceeded — ignore */
  }
}

export function clearDrawingPaths(experimentId) {
  try {
    localStorage.removeItem(getDrawingStorageKey(experimentId));
  } catch {
    /* ignore */
  }
}
