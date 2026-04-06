// ============================================
// ELAB Tutor - Sidebar Navigation Component
// Collapsible sidebar with icons + labels
// Responsive: auto-collapse on tablet, hide on mobile
// (c) Andrea Marro — 13/02/2026
// Games removed 05/04/2026 (confirmed decision by project owner)
// ============================================

import React, { useEffect, useMemo } from 'react';

// Andrea Marro — 24/02/2026
// ─── SVG Icons (18×18 stroke-based, inherits currentColor) ───
const ICON_PROPS = { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

const ICONS = {
    manual: <svg {...ICON_PROPS}><path d="M2 3.5h4c1.1 0 2 .9 2 2V15c-.7-.5-1.5-.8-2.5-.8H2V3.5z"/><path d="M16 3.5h-4c-1.1 0-2 .9-2 2V15c.7-.5 1.5-.8 2.5-.8H16V3.5z"/></svg>,
    simulator: <svg {...ICON_PROPS} viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    canvas: <svg {...ICON_PROPS}><path d="M13 2.5l2.5 2.5-8.5 8.5H4.5V11L13 2.5z"/></svg>,
    notebooks: <svg {...ICON_PROPS}><rect x="3" y="1.5" width="12" height="15" rx="2"/><path d="M6.5 5.5h5M6.5 8.5h5M6.5 11.5h3"/></svg>,
    videos: <svg {...ICON_PROPS}><circle cx="9" cy="9" r="7"/><path d="M7.5 6v6l5-3z" fill="currentColor" stroke="none"/></svg>,
    scuole: <svg {...ICON_PROPS}><path d="M2.5 15.5V8L9 4l6.5 4v7.5"/><rect x="6.5" y="10.5" width="5" height="5"/></svg>,
};

const NAV_SECTIONS = [
    {
        label: 'Risorse',
        items: [
            { id: 'manual',    icon: 'M', label: 'Manuale',    shortcut: 'Ctrl+M' },
            { id: 'simulator', icon: 'S', label: 'Simulatore', shortcut: 'Ctrl+S' },
        ]
    },
    {
        label: 'Media',
        items: [
            { id: 'videos',    icon: 'V', label: 'Video' },
        ]
    },
    {
        label: 'Personale',
        items: [
            { id: 'canvas',    icon: 'L', label: 'Lavagna' },
            { id: 'notebooks', icon: 'T', label: 'Taccuini' },
        ]
    },
];

export default function TutorSidebar({
    activeTab,
    onTabChange,
    collapsed,
    onToggleCollapsed,
}) {
    // Auto-collapse on tablet, auto-expand on desktop
    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            // On tablet (768-1023), force collapsed
            if (w >= 768 && w < 1024 && !collapsed) {
                onToggleCollapsed();
            }
            // On desktop (>=1024), auto-expand if currently collapsed by resize
            // (but don't force — user may have manually collapsed)
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <nav
            className={`tutor-sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
            role="navigation"
            aria-label="Navigazione principale"
        >
            <div className="sidebar-nav">
                {NAV_SECTIONS.map((section, si) => (
                    <div key={si} className="sidebar-section">
                        {!collapsed && (
                            <div className="sidebar-section-label">{section.label}</div>
                        )}
                        {section.items.map(item => item.href ? (
                            <a
                                key={item.id}
                                className="sidebar-item"
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={collapsed ? item.label : item.label}
                                aria-label={item.label}
                            >
                                <span className="sidebar-icon">{ICONS[item.id] || item.icon}</span>
                                {!collapsed && <span className="sidebar-label">{item.label}</span>}
                            </a>
                        ) : (
                            <button
                                key={item.id}
                                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => onTabChange(item.id)}
                                title={collapsed ? `${item.label}${item.shortcut ? ` (${item.shortcut})` : ''}` : (item.shortcut || item.label)}
                                aria-label={item.label}
                                aria-current={activeTab === item.id ? 'page' : undefined}
                            >
                                <span className="sidebar-icon">{ICONS[item.id] || item.icon}</span>
                                {!collapsed && <span className="sidebar-label">{item.label}</span>}
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <button
                    className="sidebar-collapse-btn"
                    onClick={onToggleCollapsed}
                    title={collapsed ? 'Espandi (Ctrl+B)' : 'Comprimi (Ctrl+B)'}
                    aria-label="Toggle sidebar"
                >
                    {collapsed ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    )}
                </button>
            </div>
        </nav>
    );
}

// Mobile bottom tabs — Apple iOS tab bar style
export function MobileBottomTabs({ activeTab, onTabChange }) {
    const mobileTabs = useMemo(() => [
        { id: 'manual',    icon: ICONS.manual, label: 'Manuale' },
        { id: 'simulator', icon: ICONS.simulator, label: 'Simulatore' },
        { id: 'videos',    icon: ICONS.videos, label: 'Video' },
        { id: 'canvas',    icon: ICONS.canvas, label: 'Lavagna' },
    ], []);

    return (
        <nav
            className="tutor-mobile-tabs"
            role="tablist"
            aria-label="Navigazione rapida"
        >
                {mobileTabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                        aria-label={tab.label}
                        aria-selected={activeTab === tab.id}
                        role="tab"
                    >
                        <span className="mobile-tab-icon">{tab.icon}</span>
                        <span className="mobile-tab-label">{tab.label}</span>
                    </button>
                ))}
        </nav>
    );
}
