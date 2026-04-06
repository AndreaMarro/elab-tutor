/**
 * useLavagnaPages — Multi-page state management for ELAB Lavagna
 * Each page stores: drawing paths, text annotations, and a snapshot timestamp.
 * Pages persist to localStorage keyed by session/experiment.
 *
 * (c) Andrea Marro — 05/04/2026
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import logger from '../../utils/logger';

const MAX_PAGES = 20;
const STORAGE_PREFIX = 'elab_lavagna_pages_';
const AUTOSAVE_INTERVAL = 3000; // 3s

function createEmptyPage(index) {
  return {
    id: `page-${Date.now()}-${index}`,
    index,
    paths: [],
    annotations: [],
    label: `Pagina ${index + 1}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function getStorageKey(sessionId) {
  return `${STORAGE_PREFIX}${sessionId || 'default'}`;
}

function loadFromStorage(sessionId) {
  try {
    const raw = localStorage.getItem(getStorageKey(sessionId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(sessionId, pages) {
  try {
    const key = getStorageKey(sessionId);
    const serialized = JSON.stringify(pages);
    // Bounded storage: max 2MB per lavagna
    if (serialized.length > 2 * 1024 * 1024) {
      logger.warn('[LavagnaPages] Storage limit exceeded, skipping save');
      return;
    }
    localStorage.setItem(key, serialized);
  } catch (e) {
    logger.warn('[LavagnaPages] Save failed:', e.message);
  }
}

export default function useLavagnaPages(sessionId) {
  const [pages, setPages] = useState(() => {
    const saved = loadFromStorage(sessionId);
    return saved || [createEmptyPage(0)];
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const dirtyRef = useRef(false);

  // Re-load pages when sessionId changes
  useEffect(() => {
    const saved = loadFromStorage(sessionId);
    if (saved) {
      setPages(saved);
      setCurrentPageIndex(0);
    } else {
      setPages([createEmptyPage(0)]);
      setCurrentPageIndex(0);
    }
  }, [sessionId]);

  // Autosave on interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (dirtyRef.current) {
        dirtyRef.current = false;
        // We save inside the interval callback using the latest pages via ref
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Save whenever pages change (debounced via dirty flag)
  useEffect(() => {
    dirtyRef.current = true;
    const timer = setTimeout(() => {
      saveToStorage(sessionId, pages);
      dirtyRef.current = false;
    }, 1000);
    return () => clearTimeout(timer);
  }, [pages, sessionId]);

  const currentPage = pages[currentPageIndex] || pages[0];

  const goToPage = useCallback((index) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
    }
  }, [pages.length]);

  const goNext = useCallback(() => {
    setCurrentPageIndex(prev => Math.min(prev + 1, pages.length - 1));
  }, [pages.length]);

  const goPrev = useCallback(() => {
    setCurrentPageIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const addPage = useCallback(() => {
    setPages(prev => {
      if (prev.length >= MAX_PAGES) return prev;
      const newPage = createEmptyPage(prev.length);
      return [...prev, newPage];
    });
    // Navigate to the new page
    setPages(prev => {
      setCurrentPageIndex(prev.length - 1);
      return prev;
    });
  }, []);

  const deletePage = useCallback((index) => {
    setPages(prev => {
      if (prev.length <= 1) return prev; // Keep at least one page
      const updated = prev.filter((_, i) => i !== index).map((p, i) => ({
        ...p,
        index: i,
        label: `Pagina ${i + 1}`,
      }));
      return updated;
    });
    setCurrentPageIndex(prev => {
      if (prev >= index && prev > 0) return prev - 1;
      return prev;
    });
  }, []);

  const updatePagePaths = useCallback((paths) => {
    setPages(prev => prev.map((p, i) =>
      i === currentPageIndex
        ? { ...p, paths, updatedAt: Date.now() }
        : p
    ));
  }, [currentPageIndex]);

  const updatePageAnnotations = useCallback((annotations) => {
    setPages(prev => prev.map((p, i) =>
      i === currentPageIndex
        ? { ...p, annotations, updatedAt: Date.now() }
        : p
    ));
  }, [currentPageIndex]);

  const renameCurrentPage = useCallback((label) => {
    setPages(prev => prev.map((p, i) =>
      i === currentPageIndex
        ? { ...p, label: label || `Pagina ${i + 1}` }
        : p
    ));
  }, [currentPageIndex]);

  // Force save (e.g., on unmount or before navigation)
  const forceSave = useCallback(() => {
    saveToStorage(sessionId, pages);
    dirtyRef.current = false;
  }, [sessionId, pages]);

  return {
    pages,
    currentPage,
    currentPageIndex,
    totalPages: pages.length,
    goToPage,
    goNext,
    goPrev,
    addPage,
    deletePage,
    updatePagePaths,
    updatePageAnnotations,
    renameCurrentPage,
    forceSave,
    canGoNext: currentPageIndex < pages.length - 1,
    canGoPrev: currentPageIndex > 0,
    canAddPage: pages.length < MAX_PAGES,
  };
}
