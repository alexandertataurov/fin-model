#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '..', 'frontend', 'src', 'design-system', 'tokens', 'themes');

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3 ? normalized.split('').map(c => c + c).join('') : normalized;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const L1 = luminance(r1, g1, b1);
  const L2 = luminance(r2, g2, b2);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

function checkTheme(name, tokens) {
  const pairs = [];
  if (tokens['--background'] && tokens['--foreground']) {
    pairs.push(['--background', '--foreground']);
  }
  Object.keys(tokens).forEach(key => {
    if (key.endsWith('-foreground')) {
      const base = key.replace('-foreground', '');
      if (tokens[base]) {
        pairs.push([base, key]);
      }
    }
  });

  const failures = [];
  pairs.forEach(([bg, fg]) => {
    const ratio = contrast(tokens[bg], tokens[fg]);
    if (ratio < 4.5) {
      failures.push(`${bg} vs ${fg} = ${ratio.toFixed(2)}`);
    }
  });

  if (failures.length) {
    throw new Error(`${name} theme contrast failures:\n${failures.join('\n')}`);
  }
}

['light', 'dark'].forEach(name => {
  const file = path.join(THEMES_DIR, `${name}.json`);
  const raw = fs.readFileSync(file, 'utf8');
  const tokens = JSON.parse(raw);
  checkTheme(name, tokens);
});

console.log('All theme contrast ratios meet WCAG AA');
