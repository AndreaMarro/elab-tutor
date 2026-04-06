/**
 * ELAB E2E — UI Compliance Tests
 * Verifica regole CLAUDE.md: no emoji come icone, font minime, ecc.
 * © Andrea Marro — 05/04/2026
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SRC_DIR = join(__dirname, '../../src');

function walkJsx(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.name === '_archive' || entry.name === 'node_modules') continue;
    if (entry.isDirectory()) files.push(...walkJsx(full));
    else if (entry.name.endsWith('.jsx') && !entry.name.includes('.test.')) files.push(full);
  }
  return files;
}

const JSX_FILES = walkJsx(join(SRC_DIR, 'components'));

// ─── NO EMOJI AS ICONS ───────────────────────────────

describe('CLAUDE.md Rule #11: No emoji as icons in components', () => {
  it('no JSX component file should contain emoji surrogate pairs', () => {
    const violations = [];
    for (const file of JSX_FILES) {
      const content = readFileSync(file, 'utf8');
      const matches = content.match(/\\uD83[A-Fa-f0-9]/g);
      if (matches) {
        const relPath = file.replace(SRC_DIR, 'src');
        violations.push(relPath + ': ' + matches.length + ' emoji');
      }
    }
    expect(violations).toEqual([]);
  });
});

// ─── FONT SIZE MINIMUM ───────────────────────────────

describe('CLAUDE.md Rule #8: Font minimum 13px', () => {
  it('no browser-rendered JSX should have fontSize below 13 (excluding PDF)', () => {
    const violations = [];
    for (const file of JSX_FILES) {
      if (file.includes('SessionReportPDF') || file.includes('ReportService')) continue;
      const content = readFileSync(file, 'utf8');
      const regex = /fontSize:\s*(\d+)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const size = parseInt(match[1], 10);
        if (size > 0 && size < 13) {
          const relPath = file.replace(SRC_DIR, 'src');
          const line = content.substring(0, match.index).split('\n').length;
          violations.push(relPath + ':' + line + ' fontSize: ' + size);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});

// ─── LESSON PATHS COMPLETENESS ────────────────────────

describe('Lesson paths completeness', () => {
  it('should have 92 lesson path files', () => {
    const lpDir = join(SRC_DIR, 'data/lesson-paths');
    const files = readdirSync(lpDir).filter(f => f.endsWith('.json'));
    expect(files.length).toBe(92);
  });
});

// ─── SECURITY HEADERS ────────────────────────────────

describe('Security headers in vercel.json', () => {
  const vercelConfig = JSON.parse(readFileSync(join(__dirname, '../../vercel.json'), 'utf8'));
  const headers = vercelConfig.headers?.[0]?.headers || [];
  const headerMap = Object.fromEntries(headers.map(h => [h.key, h.value]));

  it('has Strict-Transport-Security', () => {
    expect(headerMap['Strict-Transport-Security']).toContain('max-age=');
    expect(headerMap['Strict-Transport-Security']).toContain('includeSubDomains');
  });

  it('has X-Content-Type-Options: nosniff', () => {
    expect(headerMap['X-Content-Type-Options']).toBe('nosniff');
  });

  it('has X-Frame-Options: DENY', () => {
    expect(headerMap['X-Frame-Options']).toBe('DENY');
  });

  it('has Referrer-Policy', () => {
    expect(headerMap['Referrer-Policy']).toBeTruthy();
  });

  it('has Content-Security-Policy', () => {
    const csp = headerMap['Content-Security-Policy'];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('object-src');
    expect(csp).toContain('base-uri');
    expect(csp).toContain('frame-ancestors');
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('CSP blocks unsafe-eval in script-src', () => {
    const csp = headerMap['Content-Security-Policy'];
    expect(csp).not.toContain('unsafe-eval');
  });

  it('has Permissions-Policy restricting dangerous APIs', () => {
    const pp = headerMap['Permissions-Policy'];
    expect(pp).toContain('camera=()');
    expect(pp).toContain('geolocation=()');
    expect(pp).toContain('payment=()');
  });

  it('has Cross-Origin-Opener-Policy', () => {
    expect(headerMap['Cross-Origin-Opener-Policy']).toBe('same-origin');
  });
});

// ─── CSP ALIGNMENT ───────────────────────────────────

describe('CSP alignment between index.html and vercel.json', () => {
  const indexHtml = readFileSync(join(__dirname, '../../index.html'), 'utf8');
  const vercelConfig = JSON.parse(readFileSync(join(__dirname, '../../vercel.json'), 'utf8'));
  const vercelHeaders = vercelConfig.headers?.[0]?.headers || [];
  const vercelCSP = vercelHeaders.find(h => h.key === 'Content-Security-Policy')?.value || '';

  it('index.html has CSP meta tag', () => {
    expect(indexHtml).toContain('Content-Security-Policy');
  });

  it('both CSP have object-src none', () => {
    expect(indexHtml).toContain("object-src 'none'");
    expect(vercelCSP).toContain("object-src 'none'");
  });

  it('both CSP have frame-ancestors none', () => {
    expect(indexHtml).toContain("frame-ancestors 'none'");
    expect(vercelCSP).toContain("frame-ancestors 'none'");
  });

  it('neither CSP allows unsafe-eval', () => {
    expect(indexHtml).not.toContain('unsafe-eval');
    expect(vercelCSP).not.toContain('unsafe-eval');
  });

  it('CSP connect-src does not have overly broad wildcards', () => {
    expect(vercelCSP).not.toContain('connect-src *');
    expect(vercelCSP).not.toContain("connect-src 'unsafe-inline'");
    // googleapis wildcard removed — all API calls go through nanobot backend
    expect(vercelCSP).not.toContain('*.googleapis.com');
  });
});

// ─── NO SECRETS IN SOURCE ────────────────────────────

describe('No secrets in source code', () => {
  const { readdirSync } = require('fs');
  const { join } = require('path');

  function walkFiles(dir, exts) {
    const files = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.name === 'node_modules' || entry.name === '_archive' || entry.name === 'dist') continue;
      if (entry.isDirectory()) files.push(...walkFiles(full, exts));
      else if (exts.some(e => entry.name.endsWith(e))) files.push(full);
    }
    return files;
  }

  const srcFiles = walkFiles(join(__dirname, '../../src'), ['.js', '.jsx', '.ts', '.tsx']);

  it('no hardcoded API keys or tokens in source', () => {
    const patterns = [
      /sk-[a-zA-Z0-9]{20,}/,       // OpenAI-style keys
      /sbp_[a-zA-Z0-9]{20,}/,       // Supabase access tokens
      /eyJ[a-zA-Z0-9_-]{50,}/,      // JWT tokens
      /AKIA[A-Z0-9]{16}/,           // AWS access keys
      /ghp_[a-zA-Z0-9]{36}/,        // GitHub personal tokens
    ];
    const violations = [];
    for (const file of srcFiles) {
      const content = readFileSync(file, 'utf8');
      for (const pat of patterns) {
        if (pat.test(content)) {
          violations.push(file.replace(join(__dirname, '../..'), '') + ': matches ' + pat.source);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('.env is in .gitignore', () => {
    const fs = require('fs');
    const gitignore = fs.readFileSync(join(__dirname, '../../.gitignore'), 'utf8');
    expect(gitignore).toContain('.env');
  });
});
