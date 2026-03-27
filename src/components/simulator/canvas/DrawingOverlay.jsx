/**
 * ELAB Simulator — DrawingOverlay
 * SVG-based annotation/drawing layer on top of circuit canvas
 * Supports freehand drawing, color picker, eraser, and clear all
 * Touch, mouse, and Apple Pencil compatible
 * © Andrea Marro — 13/03/2026
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';

const COLORS = [
    { name: 'Rosso', hex: '#EF4444', label: 'Rosso' },
    { name: 'Blu', hex: '#3B82F6', label: 'Blu' },
    { name: 'Verde', hex: '#10B981', label: 'Verde' },
    { name: 'Nero', hex: '#1F2937', label: 'Nero' },
];

const DEFAULT_COLOR = '#EF4444'; // Rosso
const BRUSH_WIDTH = 2;
const ERASER_WIDTH = 12;

/**
 * DrawingOverlay Component
 * Renders as an SVG on top of the canvas with a small floating toolbar
 *
 * Props:
 * - drawingEnabled: boolean — whether drawing mode is enabled
 * - canvasWidth: number — width of parent canvas container
 * - canvasHeight: number — height of parent canvas container
 * - onPathsChange: (paths) => void — callback when paths change
 */
export default function DrawingOverlay({
    drawingEnabled = false,
    canvasWidth = 800,
    canvasHeight = 600,
    onPathsChange,
}) {
    const svgRef = useRef(null);
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
    const [isEraser, setIsEraser] = useState(false);
    const [drawingMode, setDrawingMode] = useState(true);
    const [showToolbar, setShowToolbar] = useState(true);

    // Handle pointer down
    const handlePointerDown = useCallback((e) => {
        if (!drawingMode || !drawingEnabled || !showToolbar) return;

        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setCurrentPath({
            points: `${x},${y}`,
            color: isEraser ? 'transparent' : currentColor,
            isEraser,
        });
    }, [drawingMode, drawingEnabled, showToolbar, isEraser, currentColor]);

    // Handle pointer move
    const handlePointerMove = useCallback((e) => {
        if (!isDrawing || !currentPath) return;

        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentPath(prev => ({
            ...prev,
            points: `${prev.points} ${x},${y}`,
        }));
    }, [isDrawing, currentPath]);

    // Handle pointer up
    const handlePointerUp = useCallback(() => {
        if (!isDrawing || !currentPath) return;

        setIsDrawing(false);
        const newPath = { ...currentPath };
        const updatedPaths = [...paths, newPath];
        setPaths(updatedPaths);
        setCurrentPath(null);

        if (onPathsChange) {
            onPathsChange(updatedPaths);
        }
    }, [isDrawing, currentPath, paths, onPathsChange]);

    // Handle clear all
    const handleClearAll = useCallback(() => {
        setPaths([]);
        setCurrentPath(null);
        if (onPathsChange) {
            onPathsChange([]);
        }
    }, [onPathsChange]);

    // Handle toggle drawing mode
    const handleToggleDrawing = useCallback(() => {
        setDrawingMode(!drawingMode);
    }, [drawingMode]);

    // Add event listeners
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        svg.addEventListener('pointerdown', handlePointerDown);
        svg.addEventListener('pointermove', handlePointerMove);
        svg.addEventListener('pointerup', handlePointerUp);
        svg.addEventListener('pointerleave', handlePointerUp);

        return () => {
            svg.removeEventListener('pointerdown', handlePointerDown);
            svg.removeEventListener('pointermove', handlePointerMove);
            svg.removeEventListener('pointerup', handlePointerUp);
            svg.removeEventListener('pointerleave', handlePointerUp);
        };
    }, [handlePointerDown, handlePointerMove, handlePointerUp]);

    if (!drawingEnabled) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: canvasWidth,
            height: canvasHeight,
            zIndex: drawingMode ? 50 : 0,
            pointerEvents: drawingMode ? 'auto' : 'none',
            cursor: drawingMode ? (isEraser ? 'grab' : 'crosshair') : 'default',
        }}>
            {/* SVG canvas for drawing */}
            <svg
                ref={svgRef}
                width={canvasWidth}
                height={canvasHeight}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: 'transparent',
                    display: drawingMode ? 'block' : 'none',
                    touchAction: 'none',
                }}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Rendered paths */}
                {paths.map((path, i) => (
                    <path
                        key={i}
                        d={`M ${path.points}`}
                        stroke={path.isEraser ? 'transparent' : path.color}
                        strokeWidth={path.isEraser ? ERASER_WIDTH : BRUSH_WIDTH}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}

                {/* Current path being drawn */}
                {currentPath && (
                    <path
                        d={`M ${currentPath.points}`}
                        stroke={currentPath.isEraser ? 'transparent' : currentPath.color}
                        strokeWidth={currentPath.isEraser ? ERASER_WIDTH : BRUSH_WIDTH}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.8}
                    />
                )}
            </svg>

            {/* Floating toolbar — top-right */}
            {showToolbar && (
                <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    background: 'rgba(30, 41, 59, 0.95)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: 12,
                    padding: 10,
                    zIndex: 51,
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                }}>
                    {/* Drawing mode toggle */}
                    <button
                        onClick={handleToggleDrawing}
                        title={drawingMode ? 'Disattiva disegno' : 'Attiva disegno'}
                        aria-label={drawingMode ? 'Disattiva disegno' : 'Attiva disegno'}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            border: '1px solid ' + (drawingMode ? '#10B981' : 'rgba(100, 116, 139, 0.5)'),
                            background: drawingMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(71, 85, 105, 0.3)',
                            color: drawingMode ? '#10B981' : '#94A3B8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            transition: 'all 150ms',
                        }}
                    >
                        ✏️
                    </button>

                    {/* Color picker */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                    }}>
                        {COLORS.map(color => (
                            <button
                                key={color.hex}
                                onClick={() => {
                                    setCurrentColor(color.hex);
                                    setIsEraser(false);
                                }}
                                title={color.label}
                                aria-label={`Colore: ${color.label}`}
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 8,
                                    border: currentColor === color.hex && !isEraser
                                        ? `2px solid ${color.hex}`
                                        : '1px solid rgba(100, 116, 139, 0.5)',
                                    background: color.hex,
                                    cursor: 'pointer',
                                    opacity: currentColor === color.hex && !isEraser ? 1 : 0.7,
                                    transition: 'all 150ms',
                                    boxShadow: currentColor === color.hex && !isEraser
                                        ? `0 0 12px ${color.hex}40`
                                        : 'none',
                                }}
                            />
                        ))}
                    </div>

                    {/* Eraser button */}
                    <button
                        onClick={() => setIsEraser(!isEraser)}
                        title={isEraser ? 'Disattiva gomma' : 'Attiva gomma'}
                        aria-label={isEraser ? 'Disattiva gomma' : 'Attiva gomma'}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            border: '1px solid ' + (isEraser ? '#FCA5A5' : 'rgba(100, 116, 139, 0.5)'),
                            background: isEraser ? 'rgba(252, 165, 165, 0.2)' : 'rgba(71, 85, 105, 0.3)',
                            color: isEraser ? '#FCA5A5' : '#94A3B8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            transition: 'all 150ms',
                        }}
                    >
                        🧹
                    </button>

                    {/* Clear all button */}
                    <button
                        onClick={handleClearAll}
                        title="Cancella tutto"
                        aria-label="Cancella tutti i disegni"
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            border: '1px solid rgba(100, 116, 139, 0.5)',
                            background: 'rgba(71, 85, 105, 0.3)',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            transition: 'all 150ms',
                        }}
                    >
                        🗑️
                    </button>

                    {/* Close/minimize button */}
                    <button
                        onClick={() => setShowToolbar(false)}
                        title="Chiudi barra strumenti"
                        aria-label="Chiudi barra strumenti"
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            border: '1px solid rgba(100, 116, 139, 0.5)',
                            background: 'rgba(71, 85, 105, 0.3)',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            transition: 'all 150ms',
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Minimized toolbar indicator */}
            {!showToolbar && (
                <button
                    onClick={() => setShowToolbar(true)}
                    title="Mostra barra strumenti"
                    aria-label="Mostra barra strumenti disegno"
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        background: 'rgba(30, 41, 59, 0.95)',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        zIndex: 51,
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                        transition: 'all 150ms',
                    }}
                >
                    ✏️
                </button>
            )}
        </div>
    );
}
